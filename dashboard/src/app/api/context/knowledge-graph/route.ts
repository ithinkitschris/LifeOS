export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import path from 'path';
import { loadYaml, KG_PATH } from '@/lib/data-loader';

export async function GET() {
    try {
        const files = [
            'identity.yaml', 'relationships.yaml', 'behaviors.yaml', 'health.yaml',
            'locations.yaml', 'calendar.yaml', 'communications.yaml', 'digital-history.yaml',
        ];
        const [identity, relationships, behaviors, health, locations, calendar, communications, digitalHistory] =
            files.map(f => loadYaml(path.join(KG_PATH, f)));
        return NextResponse.json({
            identity, relationships, behaviors, health,
            locations, calendar, communications, digitalHistory,
        });
    } catch {
        return NextResponse.json({ error: 'Failed to load knowledge graph' }, { status: 500 });
    }
}
