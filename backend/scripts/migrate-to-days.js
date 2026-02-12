/**
 * Migration Script: Prototype -> Days Structure
 * 
 * Transforms: Prototype → Days → Frames
 * Into:       Days → Prototypes → Frames
 * 
 * What it does:
 * 1. Loads prototypes.yaml
 * 2. Transforms structure (inverts hierarchy)
 * 3. Reorganizes files from /images/{prototypeId}/{file} to /images/{date}/{prototypeId}/{file}
 * 4. Writes new days.yaml
 * 5. Creates prototype-registry.yaml
 * 6. Backs up prototypes.yaml as .bak
 * 
 * Usage:
 *   node migrate-to-days.js           # Dry run (preview changes)
 *   node migrate-to-days.js --execute # Actually execute migration
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data/prototypes');
const OLD_YAML = path.join(DATA_PATH, 'prototypes.yaml');
const NEW_YAML = path.join(DATA_PATH, 'days.yaml');
const REGISTRY_YAML = path.join(DATA_PATH, 'prototype-registry.yaml');
const BACKUP_YAML = path.join(DATA_PATH, 'prototypes.yaml.bak');
const OLD_IMAGES = path.join(DATA_PATH, 'images');
const MIGRATION_LOG = path.join(DATA_PATH, 'migration-log.json');

const isDryRun = !process.argv.includes('--execute');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║   LifeOS Prototypes Migration                              ║');
console.log('║   Prototype → Days → Frames                                ║');
console.log('║   Days → Prototypes → Frames                               ║');
console.log('║                                                            ║');
console.log(`║   Mode: ${isDryRun ? 'DRY RUN (preview only)' : 'EXECUTION (will modify files)'}           ║`);
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Migration state for rollback
const migrationState = {
    timestamp: new Date().toISOString(),
    dryRun: isDryRun,
    filesMoved: [],
    errors: [],
    oldStructure: null,
    newStructure: null
};

async function main() {
    try {
        // Step 1: Load and validate old structure
        console.log('📖 Step 1: Loading prototypes.yaml...');
        if (!fs.existsSync(OLD_YAML)) {
            throw new Error(`prototypes.yaml not found at ${OLD_YAML}`);
        }

        const oldData = yaml.load(fs.readFileSync(OLD_YAML, 'utf8'));
        migrationState.oldStructure = oldData;

        if (!oldData.prototypes || !Array.isArray(oldData.prototypes)) {
            throw new Error('Invalid prototypes.yaml structure');
        }

        console.log(`   ✓ Loaded ${oldData.prototypes.length} prototypes`);

        // Step 2: Transform structure
        console.log('\n🔄 Step 2: Transforming data structure...');
        const { days, prototypes } = transformStructure(oldData);

        migrationState.newStructure = { days, prototypes };

        console.log(`   ✓ Transformed into ${days.length} days`);
        console.log(`   ✓ Created registry with ${prototypes.length} prototype definitions`);

        // Step 3: Plan file moves
        console.log('\n📦 Step 3: Planning file reorganization...');
        const fileMoves = planFileMoves(oldData, days);

        console.log(`   ✓ Planned ${fileMoves.length} file moves`);

        // Step 4: Validate
        console.log('\n✅ Step 4: Validation...');
        validate(oldData, days, fileMoves);
        console.log('   ✓ All validations passed');

        if (isDryRun) {
            console.log('\n' + '='.repeat(60));
            console.log('DRY RUN COMPLETE - No files modified');
            console.log('='.repeat(60));
            console.log('\n📋 Summary:');
            console.log(`   • ${oldData.prototypes.length} prototypes → ${days.length} days`);
            console.log(`   • ${fileMoves.length} files to be moved`);
            console.log(`   • ${prototypes.length} prototype definitions to be created`);

            console.log('\n📁 Sample file moves:');
            fileMoves.slice(0, 3).forEach(move => {
                console.log(`   ${move.from}`);
                console.log(`   → ${move.to}\n`);
            });

            console.log('\n🚀 To execute migration, run:');
            console.log('   node migrate-to-days.js --execute\n');

            return;
        }

        // Execute migration
        console.log('\n🚀 Step 5: Executing migration...');

        // 5a: Backup original
        console.log('   Creating backup...');
        fs.copyFileSync(OLD_YAML, BACKUP_YAML);
        console.log(`   ✓ Backed up to ${path.basename(BACKUP_YAML)}`);

        // 5b: Move files
        console.log('   Moving files...');
        for (const move of fileMoves) {
            try {
                // Create destination directory
                const destDir = path.dirname(move.to);
                fs.mkdirSync(destDir, { recursive: true });

                // Move file
                if (fs.existsSync(move.from)) {
                    fs.renameSync(move.from, move.to);
                    migrationState.filesMoved.push({ from: move.from, to: move.to });
                } else {
                    console.warn(`   ⚠️  File not found: ${move.from}`);
                    migrationState.errors.push(`File not found: ${move.from}`);
                }
            } catch (err) {
                console.error(`   ✗ Failed to move ${move.from}: ${err.message}`);
                migrationState.errors.push(`Move failed: ${move.from} - ${err.message}`);
            }
        }
        console.log(`   ✓ Moved ${migrationState.filesMoved.length} files`);

        // 5c: Write new YAML files
        console.log('   Writing new YAML files...');

        const daysYaml = yaml.dump({ days }, {
            indent: 2,
            lineWidth: 100,
            noRefs: true,
            quotingType: '"',
            forceQuotes: true
        });
        fs.writeFileSync(NEW_YAML, daysYaml);
        console.log(`   ✓ Created ${path.basename(NEW_YAML)}`);

        const registryYaml = yaml.dump({ prototypes }, {
            indent: 2,
            lineWidth: 100,
            noRefs: true
        });
        fs.writeFileSync(REGISTRY_YAML, registryYaml);
        console.log(`   ✓ Created ${path.basename(REGISTRY_YAML)}`);

        // 5d: Write migration log
        fs.writeFileSync(MIGRATION_LOG, JSON.stringify(migrationState, null, 2));
        console.log(`   ✓ Created migration log`);

        // Cleanup empty directories
        console.log('   Cleaning up empty directories...');
        cleanupEmptyDirs(OLD_IMAGES);

        console.log('\n' + '='.repeat(60));
        console.log('✅ MIGRATION COMPLETE');
        console.log('='.repeat(60));
        console.log(`\n📊 Results:`);
        console.log(`   • ${days.length} days created`);
        console.log(`   • ${migrationState.filesMoved.length} files moved`);
        console.log(`   • ${migrationState.errors.length} errors`);

        if (migrationState.errors.length > 0) {
            console.log('\n⚠️  Errors occurred:');
            migrationState.errors.forEach(err => console.log(`   • ${err}`));
        }

        console.log('\n📝 Next steps:');
        console.log('   1. Review migration-log.json for details');
        console.log('   2. Test the new API routes');
        console.log('   3. Update frontend to use new structure');
        console.log('   4. If rollback needed, run: node rollback-migration.js\n');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);

        if (!isDryRun) {
            console.log('\n⚠️  Migration was interrupted. You may need to rollback.');
            console.log('   Check migration-log.json for details of what was completed.');

            // Save error state
            migrationState.errors.push(error.message);
            fs.writeFileSync(MIGRATION_LOG, JSON.stringify(migrationState, null, 2));
        }

        process.exit(1);
    }
}

/**
 * Transform Prototype → Days structure into Days → Prototypes
 */
function transformStructure(oldData) {
    const daysMap = new Map();
    const prototypesRegistry = [];

    // Build registry of prototype definitions
    for (const proto of oldData.prototypes) {
        prototypesRegistry.push({
            id: proto.id,
            name: proto.name,
            description: proto.description || ''
        });

        // For each day in this prototype, add to days map
        for (const day of proto.days || []) {
            if (!daysMap.has(day.date)) {
                daysMap.set(day.date, {
                    date: day.date,
                    prototypes: []
                });
            }

            const dayEntry = daysMap.get(day.date);
            dayEntry.prototypes.push({
                id: proto.id,
                name: proto.name,
                screenshots: day.screenshots.map(shot => ({
                    ...shot,
                    // Update path to new structure
                    path: `/prototype-images/${day.date}/${proto.id}/${shot.filename}`
                }))
            });
        }
    }

    // Convert map to array and sort by date (newest first)
    const days = Array.from(daysMap.values())
        .sort((a, b) => b.date.localeCompare(a.date));

    return { days, prototypes: prototypesRegistry };
}

/**
 * Plan file moves from old to new structure
 */
function planFileMoves(oldData, days) {
    const moves = [];

    for (const day of days) {
        for (const proto of day.prototypes) {
            for (const shot of proto.screenshots) {
                const oldPath = path.join(OLD_IMAGES, proto.id, shot.filename);
                const newPath = path.join(OLD_IMAGES, day.date, proto.id, shot.filename);

                moves.push({
                    from: oldPath,
                    to: newPath,
                    date: day.date,
                    prototype: proto.id,
                    filename: shot.filename
                });
            }
        }
    }

    return moves;
}

/**
 * Validate transformation
 */
function validate(oldData, days, fileMoves) {
    // Count total screenshots in old structure
    let oldScreenshotCount = 0;
    for (const proto of oldData.prototypes) {
        for (const day of proto.days || []) {
            oldScreenshotCount += day.screenshots.length;
        }
    }

    // Count total screenshots in new structure
    let newScreenshotCount = 0;
    for (const day of days) {
        for (const proto of day.prototypes) {
            newScreenshotCount += proto.screenshots.length;
        }
    }

    if (oldScreenshotCount !== newScreenshotCount) {
        throw new Error(
            `Screenshot count mismatch: old=${oldScreenshotCount}, new=${newScreenshotCount}`
        );
    }

    if (fileMoves.length !== oldScreenshotCount) {
        throw new Error(
            `File move count mismatch: moves=${fileMoves.length}, screenshots=${oldScreenshotCount}`
        );
    }

    // Check for duplicate file moves
    const destinations = new Set();
    for (const move of fileMoves) {
        if (destinations.has(move.to)) {
            throw new Error(`Duplicate destination: ${move.to}`);
        }
        destinations.add(move.to);
    }
}

/**
 * Cleanup empty directories after migration
 */
function cleanupEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            cleanupEmptyDirs(fullPath);

            // After cleaning subdirectories, check if this one is empty
            const remaining = fs.readdirSync(fullPath);
            if (remaining.length === 0) {
                fs.rmdirSync(fullPath);
                console.log(`   ✓ Removed empty directory: ${path.relative(OLD_IMAGES, fullPath)}`);
            }
        }
    }
}

// Run migration
main();
