import { neon } from "@neondatabase/serverless";
import { categories } from "@/lib/gifts";

export const runtime = "nodejs";
const validIds = new Set(categories.flatMap(c => c.items.filter(i => !i.chosen).map(i => i.id)));
function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada");
  return neon(process.env.DATABASE_URL);
}
async function ensureTable() {
  const sql = database();
  await sql`CREATE TABLE IF NOT EXISTS gift_reservations (
    item_id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  return sql;
}
export async function GET() {
  try {
    const sql = await ensureTable();
    const rows = await sql`SELECT item_id FROM gift_reservations ORDER BY created_at`;
    return Response.json({ reservedIds: rows.map(row => row.item_id) });
  } catch (error) {
    console.error("Erro ao carregar reservas", error);
    return Response.json({ error: "Lista temporariamente indisponível" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json() as { itemId?: string; guestName?: string };
    const itemId = body.itemId?.trim() ?? "";
    const guestName = body.guestName?.trim() ?? "";
    if (!validIds.has(itemId) || !guestName || guestName.length > 80) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    const sql = await ensureTable();
    const inserted = await sql`INSERT INTO gift_reservations (item_id, guest_name)
      VALUES (${itemId}, ${guestName}) ON CONFLICT (item_id) DO NOTHING RETURNING item_id`;
    if (!inserted.length) return Response.json({ error: "Presente já escolhido" }, { status: 409 });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erro ao reservar presente", error);
    return Response.json({ error: "Não foi possível confirmar" }, { status: 500 });
  }
}
