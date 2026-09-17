export const dynamic = 'force-dynamic';

export function GET() {
  console.info('[dummy-nextjs-prisma] GET /health ok=true');
  return Response.json({ ok: true, app: 'dummy-nextjs-prisma' });
}
