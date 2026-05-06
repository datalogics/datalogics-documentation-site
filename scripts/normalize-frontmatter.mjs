/**
 * Normalizes frontmatter in all content .md files to match nuxt-studio's
 * serializer output, preventing the "Conflict Detected" false positives.
 *
 * Rules derived from Studio's serializer behavior (issues #137, #356, #382):
 *  - Remove null-value fields (e.g. icon: null)
 *  - Field order: title → description → navtitle → navigation → category → remaining
 *  - LF line endings throughout
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import yaml from 'js-yaml'

const CONTENT_DIR = './content'
const FIELD_ORDER = ['title', 'description', 'navtitle', 'navigation', 'category']

function getAllMdFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...getAllMdFiles(full))
    } else if (extname(entry) === '.md') {
      files.push(full)
    }
  }
  return files
}

function parseFrontmatter(content) {
  // Normalize line endings first
  const normalized = content.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return null
  return { rawYaml: match[1], body: match[2] }
}

function serializeFrontmatter(data) {
  // Remove null/undefined values
  const cleaned = {}
  for (const key of Object.keys(data)) {
    const val = data[key]
    if (val !== null && val !== undefined) {
      cleaned[key] = val
    }
  }

  // Build ordered object: preferred fields first, then remaining
  const ordered = {}
  for (const key of FIELD_ORDER) {
    if (key in cleaned) ordered[key] = cleaned[key]
  }
  for (const key of Object.keys(cleaned)) {
    if (!(key in ordered)) ordered[key] = cleaned[key]
  }

  // Use yaml.dump for stable, round-trip-safe serialization
  return yaml.dump(ordered, { lineWidth: -1, quotingType: '"', forceQuotes: false }).trimEnd()
}

function normalizeFile(filePath) {
  const original = readFileSync(filePath, 'utf8')
  const parsed = parseFrontmatter(original)
  if (!parsed) return false

  let data
  try {
    data = yaml.load(parsed.rawYaml)
  } catch (e) {
    console.warn(`  skipped (yaml parse error): ${filePath}: ${e.message}`)
    return false
  }

  if (!data || typeof data !== 'object') return false

  const normalizedFm = serializeFrontmatter(data)

  // Normalize both to strip trailing blank lines, always end with single newline
  const normalize = s => s.replace(/\r\n/g, '\n').replace(/\n+$/, '') + '\n'
  const newContent = normalize(`---\n${normalizedFm}\n---\n${parsed.body}`)
  const normalizedOriginal = normalize(original)

  if (newContent === normalizedOriginal) return false

  writeFileSync(filePath, newContent, 'utf8')
  return true
}

// Revert any changes from the broken first run before re-normalizing
const files = getAllMdFiles(CONTENT_DIR)
let changed = 0

for (const file of files) {
  try {
    if (normalizeFile(file)) {
      console.log(`normalized: ${file.replace(process.cwd() + '\\', '').replace(process.cwd() + '/', '')}`)
      changed++
    }
  } catch (e) {
    console.error(`error processing ${file}: ${e.message}`)
  }
}

console.log(`\nDone. ${changed} of ${files.length} files updated.`)
