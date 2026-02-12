/**
 * Prototypes API Routes
 * Manages prototype screenshot gallery - days and image uploads
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
const YAML_PATH = path.join(DATA_PATH, 'prototypes.yaml');
const IMAGES_PATH = path.join(DATA_PATH, 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_PATH)) {
  fs.mkdirSync(IMAGES_PATH, { recursive: true });
}

// Multer storage config - organize by prototype id
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(IMAGES_PATH, req.params.id);
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

function loadData() {
  try {
    const content = fs.readFileSync(YAML_PATH, 'utf8');
    return yaml.load(content);
  } catch {
    return { prototypes: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(YAML_PATH, yaml.dump(data, { indent: 2, lineWidth: 100, noRefs: true }));
}

// GET /api/prototypes - list all prototypes with days/screenshots
router.get('/', (_req, res) => {
  const data = loadData();
  res.json(data);
});

// POST /api/prototypes/:id/days - add a day
router.post('/:id/days', (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }

  const data = loadData();
  const proto = data.prototypes.find(p => p.id === id);
  if (!proto) {
    return res.status(404).json({ error: `Prototype "${id}" not found` });
  }

  if (proto.days.some(d => d.date === date)) {
    return res.status(409).json({ error: `Day ${date} already exists for "${id}"` });
  }

  proto.days.push({ date, screenshots: [] });
  proto.days.sort((a, b) => b.date.localeCompare(a.date)); // newest first
  saveData(data);

  res.status(201).json(proto);
});

// DELETE /api/prototypes/:id/days/:date - delete a day and its screenshots
router.delete('/:id/days/:date', (req, res) => {
  const { id, date } = req.params;

  const data = loadData();
  const proto = data.prototypes.find(p => p.id === id);
  if (!proto) {
    return res.status(404).json({ error: `Prototype "${id}" not found` });
  }

  const dayIndex = proto.days.findIndex(d => d.date === date);
  if (dayIndex === -1) {
    return res.status(404).json({ error: `Day ${date} not found for "${id}"` });
  }

  // Remove image files for this day
  const day = proto.days[dayIndex];
  for (const shot of day.screenshots) {
    const filePath = path.join(IMAGES_PATH, id, shot.filename);
    try { fs.unlinkSync(filePath); } catch {}
  }

  proto.days.splice(dayIndex, 1);
  saveData(data);

  res.json({ success: true, deleted: date });
});

// POST /api/prototypes/:id/days/:date/screenshots - upload screenshots
router.post('/:id/days/:date/screenshots', upload.array('files', 20), (req, res) => {
  const { id, date } = req.params;

  const data = loadData();
  const proto = data.prototypes.find(p => p.id === id);
  if (!proto) {
    return res.status(404).json({ error: `Prototype "${id}" not found` });
  }

  const day = proto.days.find(d => d.date === date);
  if (!day) {
    return res.status(404).json({ error: `Day ${date} not found for "${id}"` });
  }

  const newScreenshots = req.files.map(f => ({
    filename: f.filename,
    originalName: f.originalname,
    path: `/prototype-images/${id}/${f.filename}`,
    uploadedAt: new Date().toISOString()
  }));

  day.screenshots.push(...newScreenshots);
  saveData(data);

  res.status(201).json({ uploaded: newScreenshots, day });
});

export default router;
