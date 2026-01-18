#!/usr/bin/env npx tsx
/**
 * Type Contract Validation Script
 *
 * Validates that Rust-generated JSON schemas match TypeScript types in CONTRACT.ts.
 * This ensures type synchronization between the Rust backend and TypeScript frontend.
 *
 * Usage:
 *   npm run contracts:validate
 *   npx tsx scripts/validate-contracts.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

// Type mapping from JSON Schema to TypeScript
interface SchemaProperty {
  type?: string
  $ref?: string
  items?: SchemaProperty
  oneOf?: SchemaProperty[]
  anyOf?: SchemaProperty[]
  enum?: string[]
  properties?: Record<string, SchemaProperty>
  required?: string[]
  additionalProperties?: boolean | SchemaProperty
}

interface RootSchema {
  $schema?: string
  title?: string
  type?: string
  properties?: Record<string, SchemaProperty>
  definitions?: Record<string, SchemaProperty>
  oneOf?: SchemaProperty[]
  enum?: string[]
}

interface ValidationResult {
  typeName: string
  status: 'pass' | 'fail' | 'skip'
  errors: string[]
  warnings: string[]
}

// Path constants
const PROJECT_ROOT = path.resolve(__dirname, '..')
const SCHEMAS_PATH = path.join(PROJECT_ROOT, 'schemas', 'rust-schemas.json')
const CONTRACT_PATH = path.join(PROJECT_ROOT, 'src', 'CONTRACT.ts')

// TypeScript types extracted from CONTRACT.ts
interface TypeInfo {
  name: string
  kind: 'interface' | 'type' | 'enum'
  properties?: Record<string, string> // property name -> type string
  values?: string[] // for enums/union types
}

/**
 * Extract type information from CONTRACT.ts using TypeScript compiler API
 */
function extractTypeScriptTypes(filePath: string): Map<string, TypeInfo> {
  const types = new Map<string, TypeInfo>()

  if (!fs.existsSync(filePath)) {
    console.error(`CONTRACT.ts not found at: ${filePath}`)
    return types
  }

  const sourceText = fs.readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(
    'CONTRACT.ts',
    sourceText,
    ts.ScriptTarget.Latest,
    true
  )

  function visit(node: ts.Node) {
    // Interface declarations
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text
      const properties: Record<string, string> = {}

      node.members.forEach((member) => {
        if (ts.isPropertySignature(member) && member.name) {
          const propName = member.name.getText(sourceFile)
          const propType = member.type ? member.type.getText(sourceFile) : 'any'
          properties[propName] = propType
        }
      })

      types.set(name, { name, kind: 'interface', properties })
    }

    // Type alias declarations
    if (ts.isTypeAliasDeclaration(node)) {
      const name = node.name.text

      // Check if it's a union of string literals (like enum)
      if (ts.isUnionTypeNode(node.type)) {
        const values: string[] = []
        node.type.types.forEach((t) => {
          if (ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)) {
            values.push(t.literal.text)
          }
        })
        if (values.length > 0) {
          types.set(name, { name, kind: 'enum', values })
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return types
}

/**
 * Convert JSON Schema type to TypeScript type string
 */
function schemaTypeToTs(schema: SchemaProperty): string {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop() || 'unknown'
    return refName
  }

  if (schema.oneOf || schema.anyOf) {
    const variants = (schema.oneOf || schema.anyOf || [])
      .map((s) => schemaTypeToTs(s))
      .join(' | ')
    return variants || 'unknown'
  }

  if (schema.enum) {
    return schema.enum.map((v) => `'${v}'`).join(' | ')
  }

  switch (schema.type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'null':
      return 'null'
    case 'array':
      if (schema.items) {
        return `${schemaTypeToTs(schema.items)}[]`
      }
      return 'unknown[]'
    case 'object':
      if (schema.additionalProperties) {
        const valueType =
          typeof schema.additionalProperties === 'object'
            ? schemaTypeToTs(schema.additionalProperties)
            : 'unknown'
        return `Record<string, ${valueType}>`
      }
      return 'object'
    default:
      return 'unknown'
  }
}

/**
 * Validate a single schema against TypeScript type
 */
function validateSchema(
  schemaName: string,
  schema: RootSchema,
  tsTypes: Map<string, TypeInfo>
): ValidationResult {
  const result: ValidationResult = {
    typeName: schemaName,
    status: 'pass',
    errors: [],
    warnings: [],
  }

  // Find corresponding TypeScript type
  const tsType = tsTypes.get(schemaName)
  if (!tsType) {
    result.status = 'skip'
    result.warnings.push(`No TypeScript type found for: ${schemaName}`)
    return result
  }

  // For enum types
  if (schema.oneOf || schema.enum) {
    const rustValues: string[] = []
    if (schema.oneOf) {
      schema.oneOf.forEach((variant) => {
        if (variant.enum && variant.enum[0]) {
          rustValues.push(variant.enum[0])
        } else if (variant.type === 'string' && variant.enum) {
          rustValues.push(...variant.enum)
        }
      })
    } else if (schema.enum) {
      rustValues.push(...schema.enum)
    }

    if (tsType.kind === 'enum' && tsType.values) {
      const missingInTs = rustValues.filter((v) => !tsType.values!.includes(v))
      const extraInTs = tsType.values.filter((v) => !rustValues.includes(v))

      if (missingInTs.length > 0) {
        result.status = 'fail'
        result.errors.push(
          `Values in Rust but not in TypeScript: ${missingInTs.join(', ')}`
        )
      }
      if (extraInTs.length > 0) {
        result.status = 'fail'
        result.errors.push(
          `Values in TypeScript but not in Rust: ${extraInTs.join(', ')}`
        )
      }
    }
    return result
  }

  // For object/interface types
  if (schema.properties && tsType.kind === 'interface' && tsType.properties) {
    const schemaProps = Object.keys(schema.properties)
    const tsProps = Object.keys(tsType.properties)

    // Check for missing/extra properties
    const missingInTs = schemaProps.filter((p) => !tsProps.includes(p))
    const extraInTs = tsProps.filter((p) => !schemaProps.includes(p))

    if (missingInTs.length > 0) {
      result.status = 'fail'
      result.errors.push(
        `Properties in Rust but not in TypeScript: ${missingInTs.join(', ')}`
      )
    }
    if (extraInTs.length > 0) {
      result.warnings.push(
        `Properties in TypeScript but not in Rust schema: ${extraInTs.join(', ')}`
      )
    }

    // Check required vs optional
    const required = schema.required || []
    for (const propName of schemaProps) {
      const tsPropType = tsType.properties[propName]
      if (!tsPropType) continue

      const isRequiredInRust = required.includes(propName)
      const isOptionalInTs =
        tsPropType.includes('| null') || tsPropType.includes('?')

      if (isRequiredInRust && isOptionalInTs) {
        result.warnings.push(
          `Property '${propName}' is required in Rust but optional in TypeScript`
        )
      }
    }
  }

  return result
}

/**
 * Main validation function
 */
async function main() {
  console.log('🔍 Type Contract Validation\n')
  console.log('Checking Rust schemas against CONTRACT.ts...\n')

  // Check if schemas file exists
  if (!fs.existsSync(SCHEMAS_PATH)) {
    console.error(`❌ Schemas file not found: ${SCHEMAS_PATH}`)
    console.log('\nRun "npm run contracts:generate" first to generate schemas.')
    process.exit(1)
  }

  // Load schemas
  const schemasJson = fs.readFileSync(SCHEMAS_PATH, 'utf-8')
  const schemas: Record<string, RootSchema> = JSON.parse(schemasJson)

  // Extract TypeScript types
  const tsTypes = extractTypeScriptTypes(CONTRACT_PATH)
  console.log(`Found ${tsTypes.size} types in CONTRACT.ts`)
  console.log(`Found ${Object.keys(schemas).length} schemas from Rust\n`)

  // Validate each schema
  const results: ValidationResult[] = []
  for (const [name, schema] of Object.entries(schemas)) {
    const result = validateSchema(name, schema, tsTypes)
    results.push(result)
  }

  // Print results
  const passed = results.filter((r) => r.status === 'pass')
  const failed = results.filter((r) => r.status === 'fail')
  const skipped = results.filter((r) => r.status === 'skip')

  console.log('Results:')
  console.log('─'.repeat(60))

  for (const result of results) {
    const icon =
      result.status === 'pass'
        ? '✅'
        : result.status === 'fail'
          ? '❌'
          : '⚠️'
    console.log(`${icon} ${result.typeName}`)

    for (const error of result.errors) {
      console.log(`   ❌ ${error}`)
    }
    for (const warning of result.warnings) {
      console.log(`   ⚠️  ${warning}`)
    }
  }

  console.log('─'.repeat(60))
  console.log(
    `\nSummary: ${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`
  )

  if (failed.length > 0) {
    console.log('\n❌ Type contract validation FAILED')
    console.log(
      'Fix the type mismatches above to ensure Rust and TypeScript stay in sync.'
    )
    process.exit(1)
  }

  if (skipped.length > 0 && passed.length === 0) {
    console.log(
      '\n⚠️  No types could be validated - check schema and type naming'
    )
    process.exit(0)
  }

  console.log('\n✅ Type contract validation PASSED')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
