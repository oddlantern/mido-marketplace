# Multi-Language Coordination Reference

## Framework-Idiomatic Type Patterns

Before mirroring a type into a target language, read the workspace CLAUDE.md for that language.
If CLAUDE.md specifies a different pattern, it takes precedence over these defaults.

| Language/Framework | Data Class Pattern | Enum Pattern | Serialisation |
|---|---|---|---|
| **Dart/Flutter** | `freezed` sealed class with `@JsonSerializable` | `enum` with `String` extension or `freezed` union | `json_serializable` / `freezed`'s `fromJson` |
| **TypeScript** | `interface` or `type` (no `class` for DTOs) | `const enum` or string union type | Zod schema for runtime validation |
| **Python** | `@dataclass` or Pydantic `BaseModel` | `StrEnum` (3.11+) or `Enum` with string values | Pydantic serialisation |
| **Rust** | `struct` with `#[derive(Serialize, Deserialize)]` | `enum` with `#[serde(rename_all = "snake_case")]` | `serde` |
| **Go** | `struct` with `json:"field_name"` tags | `const` block with `iota` or string constants | `encoding/json` |
| **Kotlin** | `data class` with `@Serializable` | `enum class` with `@SerialName` | `kotlinx.serialization` |

## Contract Conflict Resolution

When defining shared contracts across languages, check for type system mismatches:

| Conflict | Example | Resolution |
|---|---|---|
| **Numeric precision** | TypeScript `number` (float64) vs Dart `int` | Define canonical type in the contract (e.g., "price is integer cents, not float dollars") |
| **Null vs undefined** | TypeScript distinguishes `null`/`undefined`; Dart, Python, Go have only one null concept | Contract uses `null` exclusively for absent values |
| **Date/time formats** | Different default serialisation across languages | Contract specifies wire format explicitly (e.g., "ISO 8601 with timezone") |
| **Enum string casing** | TypeScript `camelCase` vs Python `UPPER_SNAKE` | Contract specifies the JSON wire value; each language maps internally |

Resolve conflicts before dispatching any engineer — do not leave resolution to individual dispatches.
