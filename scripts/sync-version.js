#!/usr/bin/env node
/**
 * Version Sync Script
 * Synchronizes version across package.json, Cargo.toml, and tauri.conf.json
 *
 * Usage: node scripts/sync-version.js <version>
 * Example: node scripts/sync-version.js 0.2.0
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const FILES = {
  packageJson: path.join(ROOT, 'package.json'),
  cargoToml: path.join(ROOT, 'src-tauri', 'Cargo.toml'),
  tauriConf: path.join(ROOT, 'src-tauri', 'tauri.conf.json'),
};

function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
  if (!semverRegex.test(version)) {
    console.error(`Invalid version format: ${version}`);
    console.error('Expected semantic version (e.g., 1.0.0, 1.0.0-beta.1)');
    process.exit(1);
  }
  return version;
}

function updatePackageJson(version) {
  const content = JSON.parse(fs.readFileSync(FILES.packageJson, 'utf8'));
  const oldVersion = content.version;
  content.version = version;
  fs.writeFileSync(FILES.packageJson, JSON.stringify(content, null, 2) + '\n');
  console.log(`package.json: ${oldVersion} -> ${version}`);
}

function updateCargoToml(version) {
  let content = fs.readFileSync(FILES.cargoToml, 'utf8');
  const oldVersionMatch = content.match(/^version\s*=\s*"([^"]+)"/m);
  const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'unknown';

  // Only update the first [package] version, not dependency versions
  let updated = false;
  content = content.replace(
    /^(\[package\][\s\S]*?^version\s*=\s*)"[^"]+"/m,
    (match, prefix) => {
      updated = true;
      return `${prefix}"${version}"`;
    }
  );

  if (!updated) {
    // Fallback: update first version occurrence
    content = content.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`);
  }

  fs.writeFileSync(FILES.cargoToml, content);
  console.log(`Cargo.toml: ${oldVersion} -> ${version}`);
}

function updateTauriConf(version) {
  const content = JSON.parse(fs.readFileSync(FILES.tauriConf, 'utf8'));
  const oldVersion = content.version || 'unknown';
  content.version = version;
  fs.writeFileSync(FILES.tauriConf, JSON.stringify(content, null, 2) + '\n');
  console.log(`tauri.conf.json: ${oldVersion} -> ${version}`);
}

function getCurrentVersions() {
  const pkg = JSON.parse(fs.readFileSync(FILES.packageJson, 'utf8'));
  const cargo = fs.readFileSync(FILES.cargoToml, 'utf8');
  const tauri = JSON.parse(fs.readFileSync(FILES.tauriConf, 'utf8'));

  const cargoMatch = cargo.match(/^version\s*=\s*"([^"]+)"/m);

  return {
    packageJson: pkg.version,
    cargoToml: cargoMatch ? cargoMatch[1] : 'unknown',
    tauriConf: tauri.version || 'unknown',
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage: node scripts/sync-version.js <version>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/sync-version.js 0.2.0');
    console.log('  node scripts/sync-version.js 1.0.0-beta.1');
    console.log('');
    console.log('Current versions:');
    const versions = getCurrentVersions();
    console.log(`  package.json:    ${versions.packageJson}`);
    console.log(`  Cargo.toml:      ${versions.cargoToml}`);
    console.log(`  tauri.conf.json: ${versions.tauriConf}`);
    process.exit(0);
  }

  const version = validateVersion(args[0]);

  console.log(`\nSyncing version to ${version}...\n`);

  updatePackageJson(version);
  updateCargoToml(version);
  updateTauriConf(version);

  console.log('\nVersion sync complete!');
  console.log('\nNext steps:');
  console.log(`  git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json`);
  console.log(`  git commit -m "chore: bump version to ${version}"`);
  console.log(`  git tag v${version}`);
  console.log(`  git push origin main --tags`);
}

main();
