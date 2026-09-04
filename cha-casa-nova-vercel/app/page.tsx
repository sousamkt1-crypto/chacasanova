"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Gift, Heart, Loader2, Palette, Search, Sparkles, X } from "lucide-react";
import { categories, type GiftItem } from "@/lib/gifts";

type Notice = { text: string; error?: boolean } | null;

export default function HomePage() {
  const [reservationCounts, setReservationCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<GiftItem | null>(null);
  const [guestName, setGuestName] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  function showNotice(text: string, error = false) {
    setNotice({ text, error });
    window.setTimeout(() => setNotice(null), 4500);
  }

  useEffect(() => {
    fetch("/api/reservations", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setReservationCounts(data.reservationCounts ?? {}))
      .catch(() => showNotice("Não foi possível atualizar a lista agora.", true));
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setSelected(null); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const allItems = categories.flatMap(category => category.items);
  const totalUnits = useMemo(() => allItems.reduce((sum, item) => sum + item.quantity, 0), [allItems]);
  const chosenUnits = useMemo(() => allItems.reduce((sum, item) => {
    if (item.chosen) return sum + item.quantity;
    return sum + Math.min(reservationCounts[item.id] ?? 0, item.quantity);
  }, 0), [allItems, reservationCounts]);

  async function reserveGift() {
    if (!selected || !guestName.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selected.id, guestName: guestName.trim() }),
      });
      if (response.status === 409) {
        setReservationCounts(current => ({ ...current, [selected.id]: selected.quantity }));
        showNotice("Esse presente acabou de esgotar.", true);
        setSelected(null);
        return;
      }
      if (!response.ok) throw new Error();
      setReservationCounts(current => ({ ...current, [selected.id]: Math.min((current[selected.id] ?? 0) + 1, selected.quantity) }));
      showNotice("Presente escolhido com carinho! Obrigado por participar.");
      setSelected(null);
      setGuestName("");
    } catch {
      showNotice("Não foi possível confirmar. Tente novamente em instantes.", true);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="min-h-screen overflow-hidden">
    {notice && <div className={`toast-message ${notice.error ? "error" : ""}`} role="status">{notice.text}</div>}
    <header className="hero relative px-5 pb-14 pt-10 sm:pb-20 sm:pt-14">
      <img src="/floral-frame.png" alt="" className="hero-flowers" aria-hidden="true" />
      <div className="hero-panel relative mx-auto max-w-3xl px-5 py-10 text-center sm:px-12 sm:py-14">
        <div className="monogram" aria-label="J e L"><span>J</span><i /><span>L</span></div>
        <p className="mb-5 mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-primary sm:text-sm">Um novo capítulo</p>
        <h1 className="font-display text-5xl leading-[0.96] text-foreground sm:text-7xl">Chá de Casa Nova</h1>
        <div className="ornament" aria-hidden="true"><span /><Heart className="size-4 fill-current" /><span /></div>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Cada escolha ajuda a transformar uma casa em lar. Selecione um presente e faça parte deste momento tão especial.</p>
        <div className="availability-pill mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-full px-5 py-3 text-sm">
          <Sparkles className="size-4 shrink-0 text-primary" /><span><strong>{totalUnits - chosenUnits}</strong> disponíveis</span><span className="ml-auto text-muted-foreground">{chosenUnits} escolhidos</span>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <article className="inspiration-card mb-12 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="inspiration-copy">
          <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Palette className="size-5" /></span>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">Inspiração para os presentes</p>
          <h2 className="font-display mt-2 text-3xl text-primary sm:text-4xl">Preto ou inox</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Para manter tudo em harmonia, escolha peças na cor preta ou em inox. Para os eletrodomésticos, dê preferência ao acabamento inox.</p>
        </div>
        <img src="/inspiracao-presentes.png" alt="Sugestões de presentes em preto e aço inox, com panelas, eletrodomésticos, utensílios e toalhas" className="inspiration-image" />
      </article>
      <div className="mx-auto mb-10 max-w-xl">
        <label className="search-field flex items-center gap-3 rounded-full border bg-white px-5 py-3.5 shadow-sm" htmlFor="gift-search">
          <Search className="size-5 text-primary/55" />
          <input id="gift-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar um presente..." className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground" />
        </label>
      </div>
      <div className="space-y-12">
        {categories.map(category => {
          const items = category.items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
          if (!items.length) return null;
          const Icon = category.icon;
          return <section key={category.name}>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <div><h2 className="font-display text-3xl text-primary">{category.name}</h2><p className="text-sm text-muted-foreground">Escolha uma opção abaixo</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(item => {
                const reservedCount = item.chosen ? item.quantity : Math.min(reservationCounts[item.id] ?? 0, item.quantity);
                const remaining = item.quantity - reservedCount;
                const unavailable = remaining === 0;
                const status = item.chosen && item.reservedBy
                  ? `Escolhido por ${item.reservedBy}`
                  : unavailable
                    ? "Esgotado"
                    : item.quantity > 1
                      ? `${remaining} ${remaining === 1 ? "disponível" : "disponíveis"}`
                      : "Disponível";
                return <button key={item.id} type="button" disabled={unavailable} onClick={() => setSelected(item)} className={`gift-card group overflow-hidden rounded-2xl border text-left transition ${unavailable ? "chosen" : "bg-white hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"}`}>
                  <span className="gift-media">
                    <img src={`/products/${item.id}.png`} alt={item.name} loading="lazy" />
                    <span className={`gift-badge ${unavailable ? "is-chosen" : ""}`}>{unavailable ? <Check className="size-4" /> : <Gift className="size-4" />}</span>
                  </span>
                  <span className="gift-copy"><span className="block font-medium leading-5">{item.name}</span><span className={`mt-1.5 block text-sm ${unavailable ? "text-primary/70" : "text-muted-foreground"}`}>{status}</span></span>
                </button>;
              })}
            </div>
          </section>;
        })}
      </div>
    </section>
    <footer className="site-footer px-5 py-12 text-center text-sm text-muted-foreground"><div className="footer-monogram">J <span /> L</div><p className="mt-3">Feito com carinho para celebrar um novo lar.</p></footer>

    {selected && <div className="modal-overlay" role="presentation" onMouseDown={event => event.currentTarget === event.target && setSelected(null)}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Fechar"><X className="size-5" /></button>
        <img src={`/products/${selected.id}.png`} alt="" className="modal-product-image" />
        <h2 id="dialog-title" className="font-display text-center text-3xl text-primary">Confirmar escolha</h2>
        <p className="mt-3 text-center text-base leading-6 text-muted-foreground">Você escolheu <strong className="text-foreground">{selected.name}</strong>. Informe seu nome para reservar este presente.</p>
        <label className="mt-6 block text-sm font-medium" htmlFor="guest-name">Seu nome</label>
        <input id="guest-name" autoFocus maxLength={80} value={guestName} onChange={event => setGuestName(event.target.value)} onKeyDown={event => event.key === "Enter" && reserveGift()} placeholder="Digite seu nome" className="mt-2 h-12 w-full rounded-xl border border-input bg-white px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
        <button disabled={!guestName.trim() || submitting} onClick={reserveGift} className="confirm-button mt-5" type="button">{submitting ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />} Confirmar presente</button>
      </section>
    </div>}
  </main>;
}
