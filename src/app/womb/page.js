"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Heart, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import usePregnancy from "../../components/usePregnancy";
import BottomNav from "../../components/BottomNav";
import { engine, babySize } from "../../lib/engine";

const LivingWomb = dynamic(() => import("../../components/LivingWomb"), { ssr: false });

export default function WombPage() {
  const { pregnancy, loading, ready } = usePregnancy();
  const [week, setWeek] = useState(null);
  const [playing, setPlaying] = useState(false);

  const currentWeek = pregnancy
    ? Math.min(40, Math.max(4, engine(pregnancy.lmp).week))
    : 20;

  useEffect(() => {
    if (pregnancy && week === null) setWeek(currentWeek);
  }, [pregnancy, week, currentWeek]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setWeek((w) => (w >= 40 ? (setPlaying(false), 40) : w + 1)), 950);
    return () => clearInterval(id);
  }, [playing]);

  if (!ready || loading || week === null)
    return <main style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)" }}>Preparing the womb…</main>;

  const eng = pregnancy ? engine(pregnancy.lmp) : null;
  const isToday = week === currentWeek;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 18px 120px" }}>
      <header className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="eyebrow">The Living Womb</div>
          <h1 className="serif" style={{ fontSize: 28, fontWeight: 640 }}>Week {week}</h1>
        </div>
        {isToday ? (
          <span className="chip" style={{ background: "rgba(232,115,154,.14)", color: "var(--rose)" }}>
            <Heart size={13} fill="currentColor" style={{ animation: "pulseHeart 2.4s infinite" }} />
            Live — {eng.week}w {eng.day}d today
          </span>
        ) : (
          <button className="btn btn-ghost" style={{ padding: "9px 16px", fontSize: 13 }} onClick={() => { setPlaying(false); setWeek(currentWeek); }}>
            <RotateCcw size={14} /> Back to today
          </button>
        )}
      </header>

      <div className="fade-up"><LivingWomb week={week} /></div>

      <div className="glass fade-up" style={{ padding: "16px 18px", marginTop: 14 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", textAlign: "center", marginBottom: 12 }}>
          Baby is about the size of <b style={{ color: "var(--rose)" }}>{babySize(week)}</b>
          {week >= 36 && " · turned head-down, ready for birth"}
        </div>
        <input className="wk" type="range" min={4} max={40} step={1} value={week}
          onChange={(e) => { setPlaying(false); setWeek(+e.target.value); }} aria-label="Pregnancy week" />
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
          <button className="btn btn-ghost" style={{ padding: 12 }} onClick={() => setWeek((w) => Math.max(4, w - 1))} aria-label="Previous week"><ChevronLeft size={19} /></button>
          <button className="btn btn-rose" style={{ padding: 12 }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="btn btn-ghost" style={{ padding: 12 }} onClick={() => setWeek((w) => Math.min(40, w + 1))} aria-label="Next week"><ChevronRight size={19} /></button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
