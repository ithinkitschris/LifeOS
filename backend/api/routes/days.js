/**
 * Days API Routes
 * New day-first hierarchy for prototypes
 * 
 * Structure: Days → Prototypes → Screenshots
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/prototypes');
const DAYS_YAML = path.join(DATA_PATH, 'days.yaml');
const REGISTRY_YAML = path.join(DATA_PATH, 'prototype-registry.yaml');
const IMAGES_PATH = path.join(DATA_PATH, 'images');

// Ensure directories exist
if (!fs.existsSync(IMAGES_PATH)) {
    fs.mkdirSync(IMAGES_PATH, { recursive: true });
}

// Multer storage config - organize by date/prototype
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        const { date, prototypeId } = req.params;
        const dir = path.join(IMAGES_PATH, date, prototypeId);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname) || '.png';
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${timestamp}-${base}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB for videos
});

function loadDays() {
    try {
        const content = fs.readFileSync(DAYS_YAML, 'utf8');
        return yaml.load(content);
    } catch {
        return { days: [] };
    }
}

function saveDays(data) {
    fs.writeFileSync(DAYS_YAML, yaml.dump(data, { indent: 2, lineWidth: 100, noRefs: true }));
}

function loadRegistry() {
    try {
        const content = fs.readFileSync(REGISTRY_YAML, 'utf8');
        return yaml.load(content);
    } catch {
        return { prototypes: [] };
    }
}

function saveRegistry(data) {
    fs.writeFileSync(REGISTRY_YAML, yaml.dump(data, { indent: 2, lineWidth: 100, noRefs: true }));
}

// ============================================================================
// DAYS ROUTES
// ============================================================================

// GET /api/days - List all days
router.get('/', (_req, res) => {
    const data = loadDays();
    res.json(data);
});

// GET /api/days/:date - Get single day
router.get('/:date', (req, res) => {
    const { date } = req.params;
    const data = loadDays();

    const day = data.days.find(d => d.date === date);
    if (!day) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    res.json(day);
});

// POST /api/days - Create a new day
router.post('/', (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const data = loadDays();

    // Check if day already exists
    if (data.days.some(d => d.date === date)) {
        return res.status(409).json({ error: `Day ${date} already exists` });
    }

    // Create new day
    const newDay = {
        date,
        prototypes: []
    };

    data.days.push(newDay);
    data.days.sort((a, b) => b.date.localeCompare(a.date)); // newest first
    saveDays(data);

    res.status(201).json(newDay);
});

// DELETE /api/days/:date - Delete a day and all its prototypes/screenshots
router.delete('/:date', (req, res) => {
    const { date } = req.params;
    const data = loadDays();

    const dayIndex = data.days.findIndex(d => d.date === date);
    if (dayIndex === -1) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    const day = data.days[dayIndex];

    // Delete all files for this day
    for (const proto of day.prototypes) {
        for (const shot of proto.screenshots) {
            const filePath = path.join(IMAGES_PATH, date, proto.id, shot.filename);
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.warn(`Failed to delete ${filePath}:`, err.message);
            }
        }
    }

    // Try to clean up directories
    const dayDir = path.join(IMAGES_PATH, date);
    try {
        if (fs.existsSync(dayDir)) {
            fs.rmSync(dayDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.warn(`Failed to delete directory ${dayDir}:`, err.message);
    }

    // Remove day from data
    data.days.splice(dayIndex, 1);
    saveDays(data);

    res.json({ success: true, deleted: date });
});

// ============================================================================
// PROTOTYPE MANAGEMENT WITHIN DAYS
// ============================================================================

// POST /api/days/:date/prototypes - Add a prototype to a day
router.post('/:date/prototypes', (req, res) => {
    const { date } = req.params;
    const { prototypeId, name } = req.body;

    if (!prototypeId) {
        return res.status(400).json({ error: 'prototypeId is required' });
    }

    const data = loadDays();
    const day = data.days.find(d => d.date === date);

    if (!day) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    // Check if prototype already exists in this day
    if (day.prototypes.some(p => p.id === prototypeId)) {
        return res.status(409).json({ error: `Prototype "${prototypeId}" already exists in ${date}` });
    }

    // Get prototype name from registry or use provided name
    let protoName = name;
    if (!protoName) {
        const registry = loadRegistry();
        const protoInfo = registry.prototypes.find(p => p.id === prototypeId);
        protoName = protoInfo ? protoInfo.name : prototypeId;
    }

    // Add prototype to day
    day.prototypes.push({
        id: prototypeId,
        name: protoName,
        screenshots: []
    });

    saveDays(data);
    res.status(201).json(day);
});

// DELETE /api/days/:date/prototypes/:prototypeId - Remove prototype from day
router.delete('/:date/prototypes/:prototypeId', (req, res) => {
    const { date, prototypeId } = req.params;
    const data = loadDays();

    const day = data.days.find(d => d.date === date);
    if (!day) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    const protoIndex = day.prototypes.findIndex(p => p.id === prototypeId);
    if (protoIndex === -1) {
        return res.status(404).json({ error: `Prototype "${prototypeId}" not found in ${date}` });
    }

    const proto = day.prototypes[protoIndex];

    // Delete all files for this prototype
    for (const shot of proto.screenshots) {
        const filePath = path.join(IMAGES_PATH, date, prototypeId, shot.filename);
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.warn(`Failed to delete ${filePath}:`, err.message);
        }
    }

    // Try to clean up prototype directory
    const protoDir = path.join(IMAGES_PATH, date, prototypeId);
    try {
        if (fs.existsSync(protoDir)) {
            fs.rmSync(protoDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.warn(`Failed to delete directory ${protoDir}:`, err.message);
    }

    // Remove prototype from day
    day.prototypes.splice(protoIndex, 1);
    saveDays(data);

    res.json({ success: true, deleted: prototypeId });
});

// ============================================================================
// SCREENSHOT MANAGEMENT
// ============================================================================

// POST /api/days/:date/prototypes/:prototypeId/screenshots - Upload screenshots
router.post('/:date/prototypes/:prototypeId/screenshots', upload.array('files', 20), (req, res) => {
    const { date, prototypeId } = req.params;
    const data = loadDays();

    const day = data.days.find(d => d.date === date);
    if (!day) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    const proto = day.prototypes.find(p => p.id === prototypeId);
    if (!proto) {
        return res.status(404).json({ error: `Prototype "${prototypeId}" not found in ${date}` });
    }

    const newScreenshots = req.files.map(f => ({
        filename: f.filename,
        originalName: f.originalname,
        path: `/prototype-images/${date}/${prototypeId}/${f.filename}`,
        uploadedAt: new Date().toISOString()
    }));

    proto.screenshots.push(...newScreenshots);
    saveDays(data);

    res.status(201).json({ uploaded: newScreenshots, prototype: proto });
});

// DELETE /api/days/:date/prototypes/:prototypeId/screenshots/:filename - Delete screenshot
router.delete('/:date/prototypes/:prototypeId/screenshots/:filename', (req, res) => {
    const { date, prototypeId, filename } = req.params;
    const data = loadDays();

    const day = data.days.find(d => d.date === date);
    if (!day) {
        return res.status(404).json({ error: `Day ${date} not found` });
    }

    const proto = day.prototypes.find(p => p.id === prototypeId);
    if (!proto) {
        return res.status(404).json({ error: `Prototype "${prototypeId}" not found in ${date}` });
    }

    const shotIndex = proto.screenshots.findIndex(s => s.filename === filename);
    if (shotIndex === -1) {
        return res.status(404).json({ error: `Screenshot "${filename}" not found` });
    }

    // Delete file
    const filePath = path.join(IMAGES_PATH, date, prototypeId, filename);
    try {
        fs.unlinkSync(filePath);
    } catch (err) {
        console.warn(`Failed to delete ${filePath}:`, err.message);
    }

    // Remove from data
    proto.screenshots.splice(shotIndex, 1);
    saveDays(data);

    res.json({ success: true, deleted: filename });
});

// ============================================================================
// PROTOTYPE REGISTRY ROUTES
// ============================================================================

// GET /api/days/registry/prototypes - List all prototype definitions
router.get('/registry/prototypes', (_req, res) => {
    const registry = loadRegistry();
    res.json(registry);
});

// POST /api/days/registry/prototypes - Create new prototype definition
router.post('/registry/prototypes', (req, res) => {
    const { id, name, description } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: 'id and name are required' });
    }

    const registry = loadRegistry();

    // Check if prototype already exists
    if (registry.prototypes.some(p => p.id === id)) {
        return res.status(409).json({ error: `Prototype "${id}" already exists in registry` });
    }

    // Add prototype
    registry.prototypes.push({
        id,
        name,
        description: description || ''
    });

    saveRegistry(registry);
    res.status(201).json({ id, name, description });
});

export default router;
