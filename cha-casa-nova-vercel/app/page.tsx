"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Gift, Home, Loader2, Search, Sparkles, X } from "lucide-react";
import { categories, type GiftItem } from "@/lib/gifts";

type Notice = { text: string; error?: boolean } | null;

export default function HomePage() {
  const [reserved, setReserved] = useState<Set<string>>(new Set());
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
      .then(data => setReserved(new Set(data.reservedIds ?? [])))
      .catch(() => showNotice("Não foi possível atualizar a lista agora.", true));
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setSelected(null); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const selectedIds = useMemo(() => new Set([
    ...categories.flatMap(category => category.items.filter(item => item.chosen).map(item => item.id)),
    ...reserved,
  ]), [reserved]);
  const allItems = categories.flatMap(category => category.items);
  const chosen = allItems.filter(item => selectedIds.has(item.id)).length;

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
        setReserved(current => new Set(current).add(selected.id));
        showNotice("Esse presente acabou de ser escolhido por outra pessoa.", true);
        setSelected(null);
        return;
      }
      if (!response.ok) throw new Error();
      setReserved(current => new Set(current).add(selected.id));
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
    <header className="hero relative px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="flourish flourish-left" aria-hidden="true" />
      <div className="flourish flourish-right" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm"><Home className="size-6" strokeWidth={1.6} /></div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-white/80">Um novo capítulo</p>
        <h1 className="font-display text-5xl leading-[0.96] sm:text-7xl">Chá de Casa Nova</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">Cada escolha ajuda a transformar uma casa em lar. Selecione um presente e faça parte deste momento tão especial.</p>
        <div className="mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm backdrop-blur-sm">
          <Sparkles className="size-4 shrink-0" /><span><strong>{allItems.length - chosen}</strong> disponíveis</span><span className="ml-auto text-white/70">{chosen} escolhidos</span>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
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
                const unavailable = selectedIds.has(item.id);
                return <button key={item.id} type="button" disabled={unavailable} onClick={() => setSelected(item)} className={`gift-card group flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition ${unavailable ? "chosen" : "bg-white hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"}`}>
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${unavailable ? "bg-primary/10" : "bg-secondary group-hover:bg-primary group-hover:text-white"}`}>{unavailable ? <Check className="size-5" /> : <Gift className="size-5" />}</span>
                  <span><span className="block font-medium leading-5">{item.name}</span><span className={`mt-1 block text-sm ${unavailable ? "text-primary/70" : "text-muted-foreground"}`}>{unavailable ? (item.reservedBy ? `Escolhido por ${item.reservedBy}` : "Já escolhido") : "Disponível"}</span></span>
                </button>;
              })}
            </div>
          </section>;
        })}
      </div>
    </section>
    <footer className="border-t border-primary/10 px-5 py-10 text-center text-sm text-muted-foreground"><Home className="mx-auto mb-3 size-5 text-primary" /><p>Feito com carinho para celebrar um novo lar.</p></footer>

    {selected && <div className="modal-overlay" role="presentation" onMouseDown={event => event.currentTarget === event.target && setSelected(null)}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Fechar"><X className="size-5" /></button>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Gift className="size-5" /></div>
        <h2 id="dialog-title" className="font-display text-center text-3xl text-primary">Confirmar escolha</h2>
        <p className="mt-3 text-center text-base leading-6 text-muted-foreground">Você escolheu <strong className="text-foreground">{selected.name}</strong>. Informe seu nome para reservar este presente.</p>
        <label className="mt-6 block text-sm font-medium" htmlFor="guest-name">Seu nome</label>
        <input id="guest-name" autoFocus maxLength={80} value={guestName} onChange={event => setGuestName(event.target.value)} onKeyDown={event => event.key === "Enter" && reserveGift()} placeholder="Digite seu nome" className="mt-2 h-12 w-full rounded-xl border border-input bg-white px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
        <button disabled={!guestName.trim() || submitting} onClick={reserveGift} className="confirm-button mt-5" type="button">{submitting ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />} Confirmar presente</button>
      </section>
    </div>}
  </main>;
}
