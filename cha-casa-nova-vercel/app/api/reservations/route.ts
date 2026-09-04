import { neon } from "@neondatabase/serverless";
import { categories } from "@/lib/gifts";

export const runtime = "nodejs";
const availableGifts = new Map(
  categories.flatMap(category => category.items.filter(item => !item.chosen).map(item => [item.id, item.quantity] as const))
);
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
    const reservationCounts: Record<string, number> = {};
    for (const row of rows) {
      const baseId = String(row.item_id).replace(/#\d+$/, "");
      reservationCounts[baseId] = (reservationCounts[baseId] ?? 0) + 1;
    }
    return Response.json({ reservationCounts });
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
    const quantity = availableGifts.get(itemId);
    if (!quantity || !guestName || guestName.length > 80) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    const sql = await ensureTable();
    const reservationKeys = Array.from({ length: quantity }, (_, index) => index === 0 ? itemId : `${itemId}#${index + 1}`);
    for (let index = 0; index < reservationKeys.length; index += 1) {
      const key = reservationKeys[index];
      const inserted = await sql`INSERT INTO gift_reservations (item_id, guest_name)
        VALUES (${key}, ${guestName}) ON CONFLICT (item_id) DO NOTHING RETURNING item_id`;
      if (inserted.length) return Response.json({ ok: true, reservedCount: index + 1, remaining: quantity - index - 1 }, { status: 201 });
    }
    return Response.json({ error: "Presente esgotado" }, { status: 409 });
  } catch (error) {
    console.error("Erro ao reservar presente", error);
    return Response.json({ error: "Não foi possível confirmar" }, { status: 500 });
  }
}
