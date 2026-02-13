export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { loadYaml, WORLD_PATH } from '@/lib/data-loader';

export async function GET() {
    try {
        const meta = loadYaml(path.join(WORLD_PATH, 'meta.yaml'));
        const setting = loadYaml(path.join(WORLD_PATH, 'setting.yaml'));
        const thesis = loadYaml(path.join(WORLD_PATH, 'thesis.yaml'));
        const devices = loadYaml(path.join(WORLD_PATH, 'devices.yaml'));
        const systemArchitecture = loadYaml(path.join(WORLD_PATH, 'system-architecture.yaml'));
        const providerIntegration = loadYaml(path.join(WORLD_PATH, 'provider-integration.yaml'));
        const openQuestions = loadYaml(path.join(WORLD_PATH, 'open-questions.yaml'));

        const domainsPath = path.join(WORLD_PATH, 'domains');
        const registry = loadYaml<{ domains: { id: string; file: string }[] }>(
            path.join(domainsPath, '_registry.yaml')
        );
        const domains: Record<string, unknown> = {};
        if (registry?.domains) {
            for (const ref of registry.domains) {
                try {
                    domains[ref.id] = loadYaml(path.join(domainsPath, ref.file));
                } catch { }
            }
        }

        return NextResponse.json({
            meta, setting, thesis, devices, systemArchitecture,
            providerIntegration, domains, openQuestions,
        });
    } catch {
        return NextResponse.json({ error: 'Failed to load world state' }, { status: 500 });
    }
}
