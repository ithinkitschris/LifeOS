import { NextResponse } from 'next/server';

export function readOnly() {
    return NextResponse.json(
        { error: 'Read-only deployment. Write operations are not available.' },
        { status: 405, headers: { Allow: 'GET' } }
    );
}
