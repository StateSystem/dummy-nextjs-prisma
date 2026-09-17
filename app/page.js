import { prisma } from '../lib/prisma';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const items = await prisma.item.findMany({ orderBy: { id: 'asc' } });
  console.info('[dummy-nextjs-prisma] GET / items=' + items.length);
  return <main>
    <p className="caption">DEParture deployment sample</p>
    <h1>dummy-nextjs-prisma</h1>
    <h2>Items</h2>
    {items.length === 0 ? <p>No items yet.</p> : <ul>{items.map(item => <li key={item.id}>{item.id}: {item.name}</li>)}</ul>}
    <a href="/health">Health check</a>
  </main>;
}
