#!/usr/bin/env node

/**
 * Mido Report Generator
 *
 * Reads report-data.json and the HTML template, injects data, outputs a
 * self-contained HTML report.
 *
 * Usage:
 *   node generate-report.js --template path/to/template.html --data path/to/data.json --output path/to/output.html
 */

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    args[key] = argv[i + 1];
  }
  return args;
}

function escapeHtml(str) {
  if (typeof str !== "string") return String(str);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderDeviations(deviations) {
  if (!deviations || deviations.length === 0) {
    return '<p style="color: var(--green);">No deviations from the plan.</p>';
  }
  return deviations
    .map(
      (d) => `
    <div class="deviation">
      <div class="deviation-planned">Planned: ${escapeHtml(d.planned)}</div>
      <div class="deviation-actual">Actual: ${escapeHtml(d.actual)}</div>
      <div class="deviation-reason">Reason: ${escapeHtml(d.reason)}</div>
    </div>`
    )
    .join("\n");
}

function renderFiles(files) {
  if (!files || files.length === 0) {
    return "<li>No files changed.</li>";
  }
  return files
    .map(
      (f) => `
    <li>
      <span class="badge badge-${f.action}">${f.action}</span>
      <span>${escapeHtml(f.path)}</span>
      ${f.description ? `<span style="color: var(--text-muted); font-size: 0.8rem;"> — ${escapeHtml(f.description)}</span>` : ""}
    </li>`
    )
    .join("\n");
}

function renderReviewFindings(findings) {
  if (!findings || findings.length === 0) {
    return '<p style="color: var(--green);">No review findings.</p>';
  }
  return findings
    .map(
      (f) => `
    <div class="finding ${f.severity}">
      <div class="finding-header">
        <span class="finding-title">${escapeHtml(f.finding || f.title)}</span>
        <span class="badge badge-${f.severity}">${f.severity}</span>
      </div>
      <div class="finding-location">${escapeHtml(f.file || "")}${f.line ? `:${f.line}` : ""}</div>
      <div class="finding-body">${escapeHtml(f.why || f.description || "")}</div>
      ${f.recommendation || f.remediation ? `<div class="finding-fix">${escapeHtml(f.recommendation || f.remediation)}</div>` : ""}
    </div>`
    )
    .join("\n");
}

function renderSecurityFindings(security) {
  if (!security || !security.findings || security.findings.length === 0) {
    return '<p style="color: var(--green);">No security findings.</p>';
  }
  return renderReviewFindings(security.findings);
}

function renderTestResults(tests) {
  if (!tests) {
    return "<p>No test results available.</p>";
  }
  const total = tests.total || 0;
  const passing = tests.passing || 0;
  const failing = tests.failing || 0;
  const skipped = tests.skipped || 0;
  const passPercent = total > 0 ? (passing / total) * 100 : 0;
  const failPercent = total > 0 ? (failing / total) * 100 : 0;
  const skipPercent = total > 0 ? (skipped / total) * 100 : 0;

  return `
    <div class="test-bar">
      <div class="test-bar-pass" style="width: ${passPercent}%"></div>
      <div class="test-bar-fail" style="width: ${failPercent}%"></div>
      <div class="test-bar-skip" style="width: ${skipPercent}%"></div>
    </div>
    <p>${passing} passing, ${failing} failing, ${skipped} skipped out of ${total} total</p>
    ${tests.coverage_delta ? `<p>Coverage: ${tests.coverage_delta.before} → ${tests.coverage_delta.after}</p>` : ""}
    ${tests.duration_ms ? `<p>Duration: ${tests.duration_ms}ms</p>` : ""}
  `;
}

function renderClaudeMdUpdates(updates) {
  if (!updates || updates.length === 0) {
    return "<p>No CLAUDE.md changes proposed.</p>";
  }
  return updates
    .map(
      (u) => `
    <div class="finding suggestion">
      <div class="finding-header">
        <span class="finding-title">${escapeHtml(u.file)}</span>
        <span class="badge badge-modified">${u.action || "proposed"}</span>
      </div>
      <div class="finding-body">${escapeHtml(u.proposal || u.changes || u.description)}</div>
      ${u.reason ? `<div class="finding-fix">${escapeHtml(u.reason)}</div>` : ""}
    </div>`
    )
    .join("\n");
}

function renderChangelog(entry) {
  if (!entry) return "<p>No changelog entry.</p>";
  if (typeof entry === "string") return `<div class="changelog-entry">${escapeHtml(entry)}</div>`;
  const sections = [];
  for (const [type, items] of Object.entries(entry)) {
    if (Array.isArray(items) && items.length > 0) {
      sections.push(`
        <div class="changelog-entry">
          <div class="type" style="color: var(--accent);">${escapeHtml(type)}</div>
          ${items.map((i) => `<p>— ${escapeHtml(i)}</p>`).join("")}
        </div>
      `);
    }
  }
  return sections.join("\n") || "<p>No changelog entry.</p>";
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.template || !args.data || !args.output) {
    console.error("Usage: node generate-report.js --template <path> --data <path> --output <path>");
    process.exit(1);
  }

  const template = fs.readFileSync(args.template, "utf-8");
  const data = JSON.parse(fs.readFileSync(args.data, "utf-8"));

  const meta = data.metadata || {};
  const replacements = {
    "{{title}}": escapeHtml(data.taskSummary || "Mido Report"),
    "{{date}}": meta.date || new Date().toISOString().split("T")[0],
    "{{duration}}": meta.duration || "—",
    "{{agents_used}}": String(meta.agents_used || 0),
    "{{task_summary}}": escapeHtml(data.taskSummary || ""),
    "{{files_changed_count}}": String((data.filesChanged || []).length),
    "{{blockers_count}}": String(
      (data.reviewFindings || []).filter((f) => f.severity === "blocker").length
    ),
    "{{security_findings_count}}": String(
      data.securityFindings && data.securityFindings.findings
        ? data.securityFindings.findings.length
        : 0
    ),
    "{{tests_passing}}": String(
      data.testResults ? data.testResults.passing || 0 : 0
    ),
    "{{deviations_html}}": renderDeviations(data.planVsReality),
    "{{files_html}}": renderFiles(data.filesChanged),
    "{{review_html}}": renderReviewFindings(data.reviewFindings),
    "{{security_html}}": renderSecurityFindings(data.securityFindings),
    "{{tests_html}}": renderTestResults(data.testResults),
    "{{claude_md_html}}": renderClaudeMdUpdates(data.claudeMdUpdates),
    "{{changelog_html}}": renderChangelog(data.changelogEntry),
  };

  let html = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value);
  }

  const outputDir = path.dirname(args.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(args.output, html, "utf-8");
  console.log(`Report generated: ${args.output}`);
}

main();
