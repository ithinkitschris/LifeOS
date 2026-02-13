export const dynamic = 'force-static';
import { readOnly } from '@/lib/readonly';

export async function GET() {
    return readOnly();
}

export const PUT = readOnly;
export const DELETE = readOnly;
