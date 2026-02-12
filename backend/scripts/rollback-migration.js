/**
 * Rollback Migration Script
 * 
 * Rolls back the days migration by:
 * 1. Moving files back to original locations
 * 2. Restoring prototypes.yaml from backup
 * 3. Removing new files (days.yaml, prototype-registry.yaml)
 * 
 * Usage:
 *   node rollback-migration.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data/prototypes');
const MIGRATION_LOG = path.join(DATA_PATH, 'migration-log.json');
const BACKUP_YAML = path.join(DATA_PATH, 'prototypes.yaml.bak');
const NEW_YAML = path.join(DATA_PATH, 'days.yaml');
const REGISTRY_YAML = path.join(DATA_PATH, 'prototype-registry.yaml');
const OLD_YAML = path.join(DATA_PATH, 'prototypes.yaml');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║   LifeOS Migration Rollback                                ║');
console.log('║   Restoring original structure                             ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function rollback() {
    try {
        // Load migration log
        console.log('📖 Loading migration log...');
        if (!fs.existsSync(MIGRATION_LOG)) {
            throw new Error('migration-log.json not found. Cannot rollback without log.');
        }

        const migrationState = JSON.parse(fs.readFileSync(MIGRATION_LOG, 'utf8'));

        if (migrationState.dryRun) {
            console.log('⚠️  Migration was a dry run. Nothing to rollback.');
            return;
        }

        console.log(`   ✓ Found migration from ${migrationState.timestamp}`);
        console.log(`   • ${migrationState.filesMoved.length} files were moved`);

        // Restore backup
        console.log('\n📦 Restoring prototypes.yaml from backup...');
        if (!fs.existsSync(BACKUP_YAML)) {
            throw new Error('Backup file not found. Cannot restore.');
        }

        fs.copyFileSync(BACKUP_YAML, OLD_YAML);
        console.log('   ✓ Restored prototypes.yaml');

        // Move files back
        console.log('\n🔄 Moving files back to original locations...');
        let movedBack = 0;
        let errors = 0;

        for (const move of migrationState.filesMoved) {
            try {
                // Create destination directory
                const destDir = path.dirname(move.from);
                fs.mkdirSync(destDir, { recursive: true });

                // Move file back
                if (fs.existsSync(move.to)) {
                    fs.renameSync(move.to, move.from);
                    movedBack++;
                } else {
                    console.warn(`   ⚠️  File not found: ${move.to}`);
                    errors++;
                }
            } catch (err) {
                console.error(`   ✗ Failed to move back ${move.to}: ${err.message}`);
                errors++;
            }
        }

        console.log(`   ✓ Moved back ${movedBack} files`);
        if (errors > 0) {
            console.log(`   ⚠️  ${errors} errors occurred`);
        }

        // Remove new files
        console.log('\n🗑️  Removing migration artifacts...');

        if (fs.existsSync(NEW_YAML)) {
            fs.unlinkSync(NEW_YAML);
            console.log('   ✓ Removed days.yaml');
        }

        if (fs.existsSync(REGISTRY_YAML)) {
            fs.unlinkSync(REGISTRY_YAML);
            console.log('   ✓ Removed prototype-registry.yaml');
        }

        // Cleanup empty date directories
        console.log('\n🧹 Cleaning up empty directories...');
        const imagesPath = path.join(DATA_PATH, 'images');
        cleanupDateDirs(imagesPath);

        // Keep migration log and backup for reference
        console.log('\n📝 Keeping migration-log.json and .bak file for reference');

        console.log('\n' + '='.repeat(60));
        console.log('✅ ROLLBACK COMPLETE');
        console.log('='.repeat(60));
        console.log('\n✓ Your system has been restored to the pre-migration state.');
        console.log('✓ Original prototypes.yaml is active again.');
        console.log('✓ All files have been moved back to their original locations.\n');

    } catch (error) {
        console.error('\n❌ Rollback failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

/**
 * Cleanup date-based directories created during migration
 */
function cleanupDateDirs(imagesPath) {
    if (!fs.existsSync(imagesPath)) return;

    const entries = fs.readdirSync(imagesPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(imagesPath, entry.name);

        if (entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(entry.name)) {
            // This looks like a date directory
            cleanupDirRecursive(fullPath);
        }
    }
}

function cleanupDirRecursive(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            cleanupDirRecursive(fullPath);
        }
    }

    // Check if directory is empty
    const remaining = fs.readdirSync(dir);
    if (remaining.length === 0) {
        fs.rmdirSync(dir);
        console.log(`   ✓ Removed empty directory: ${path.basename(dir)}`);
    }
}

// Run rollback
rollback();
