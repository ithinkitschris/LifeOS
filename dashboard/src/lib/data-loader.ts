import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// On Vercel, process.cwd() is the project root (dashboard/).
// The build command copies backend/data → dashboard/data before the build.
const DATA_ROOT = path.join(process.cwd(), 'data');

export const WORLD_PATH = path.join(DATA_ROOT, 'world');
export const KG_PATH = path.join(DATA_ROOT, 'knowledge-graph');
export const CONVERSATIONS_PATH = path.join(DATA_ROOT, 'conversations');
export const SCENARIOS_PATH = path.join(DATA_ROOT, 'scenarios');
export const PROTOTYPES_PATH = path.join(DATA_ROOT, 'prototypes');

export function loadYaml<T = unknown>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content) as T;
}

export function loadJson<T = unknown>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
}
