"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Baby, Activity, ChevronRight, Check, Clock } from "lucide-react";
import usePregnancy from "../components/usePregnancy";
import EnableNotifications from "../components/EnableNotifications";
import BottomNav from "../components/BottomNav";
import { engine, fmtDate, weekDate, SCANS, babySize } from "../lib/engine";

function Setup({ create }) {
  const [name, setName] = useState("");
  const [lmp, setLmp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (!lmp) return setErr("Please pick your LMP date");
    setBusy(true);
    const { error } = await create(name || "Mama", lmp);
    if (error) { setErr(error.message); setBusy(false); }
  };
  return (
    <div className="glass fade-up" style={{ padding: 26, maxWidth: 440, margin: "60px auto" }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Welcome to</div>
      <h1 className="serif" style={{ fontSize: 30, fontWeight: 640, marginBottom: 6 }}>Mother Journey</h1>
      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 20 }}>
        Two details and your whole pregnancy timeline builds itself.
      </p>
      <label style={{ fontSize: 12.5, fontWeight: 700 }}>Your name</label>
      <input className="mj" style={{ margin: "6px 0 14px" }} placeholder="e.g. Marziya"
        value={name} onChange={(e) => setName(e.target.value)} />
      <label style={{ fontSize: 12.5, fontWeight: 700 }}>First day of your last period (LMP)</label>
      <input className="mj" type="date" style={{ margin: "6px 0 18px" }}
        value={lmp} onChange={(e) => setLmp(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
      {err && <p style={{ color: "var(--rose)", fontSize: 12.5, marginBottom: 10 }}>{err}</p>}
      <button className="btn btn-rose" style={{ width: "100%" }} onClick={go} disabled={busy}>
        {busy ? "Creating your journey…" : "Start my pregnancy timeline"}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { pregnancy, loading, ready, create } = usePregnancy();

  if (!ready)
    return (
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "60px 18px" }}>
        <div className="glass" style={{ padding: 26 }}>
          <h1 className="serif" style={{ fontSize: 24, marginBottom: 10 }}>Almost there</h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
            Add <b>NEXT_PUBLIC_SUPABASE_URL</b> and <b>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</b> to your
            environment variables, run <b>supabase/schema.sql</b> in the Supabase SQL editor, and redeploy.
            Full steps are in DEPLOY.md.
          </p>
        </div>
      </main>
    );
  if (loading) return <main style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)" }}>Loading your journey…</main>;
  if (!pregnancy) return <main style={{ padding: "0 18px" }}><Setup create={create} /></main>;

  const eng = engine(pregnancy.lmp);
  const nextScan = SCANS.find((s) => s.week > eng.week) || SCANS[SCANS.length - 1];

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "24px 18px 120px" }}>
      <header className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#F191B4,#C77FE0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
          {pregnancy.mother_name[0]?.toUpperCase()}
        </span>
        <div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 640 }}>Hello, {pregnancy.mother_name} 👋</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", fontWeight: 600 }}>Happy pregnancy!</div>
        </div>
      </header>

      <section className="glass fade-up" style={{ padding: 24, textAlign: "center", marginBottom: 14, boxShadow: "var(--shadow-3d)" }}>
        <div className="eyebrow">You are</div>
        <div className="serif" style={{ fontSize: 44, fontWeight: 640, margin: "6px 0 2px" }}>
          {eng.week}w {eng.day}d
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", fontWeight: 600 }}>
          {["First", "Second", "Third"][eng.trimester - 1]} trimester · month {eng.month}
        </div>
        <div style={{ height: 10, borderRadius: 99, background: "rgba(155,127,232,.15)", margin: "16px 0 8px", overflow: "hidden" }}>
          <div style={{ width: `${eng.progress}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#F191B4,#C77FE0)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--ink-soft)" }}>
          <span>{eng.progress}% complete</span><span>{eng.daysRemaining} days to go</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 13.5, color: "var(--ink-soft)" }}>
          Baby is about the size of <b style={{ color: "var(--rose)" }}>{babySize(eng.week)}</b> · EDD <b>{fmtDate(eng.edd)}</b>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/womb" className="btn btn-rose" style={{ textDecoration: "none" }}>
            <Baby size={17} /> See the living womb
          </Link>
        </div>
      </section>

      <section className="glass fade-up" style={{ padding: 16, display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
        <span style={{ width: 46, height: 46, borderRadius: 15, background: "linear-gradient(135deg,#FBD5E3,#F7C3D8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Activity size={21} color="#E8739A" />
        </span>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ fontSize: 10.5 }}>Upcoming</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{nextScan.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", fontWeight: 600 }}>
            Week {nextScan.week} · {fmtDate(weekDate(pregnancy.lmp, nextScan.week))}
          </div>
        </div>
        <ChevronRight size={18} color="#B4A8C9" />
      </section>

      <section className="glass fade-up" style={{ padding: "18px 18px 8px", marginBottom: 14 }}>
        <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 10 }}>Pregnancy timeline</div>
        {SCANS.map((s) => {
          const past = s.week < eng.week;
          const now = s.week >= eng.week && s.week <= eng.week + 1 && s.week !== 40;
          return (
            <div key={s.week} style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: "1px dashed rgba(155,127,232,.16)" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff",
                background: past ? "#8FD8C0" : now ? "linear-gradient(135deg,#F191B4,#E8739A)" : "rgba(255,255,255,.85)",
                border: past || now ? "none" : "2px solid #E3D9FB" }}>
                {past ? <Check size={14} strokeWidth={3} /> : now ? <Activity size={13} /> : <Clock size={13} color="#B4A8C9" />}
              </span>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 13.5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>
                Wk {s.week} · {fmtDate(weekDate(pregnancy.lmp, s.week)).slice(0, 6)}
              </div>
            </div>
          );
        })}
      </section>

      <section className="glass fade-up" style={{ padding: 18, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>
          <Heart size={14} color="#E8739A" fill="#E8739A" style={{ verticalAlign: "-2px" }} /> Daily nudge at 9 am
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
          A gentle reminder with your week, baby's size and your log.
        </p>
        <EnableNotifications pregnancyId={pregnancy.id} />
      </section>
      <BottomNav />
    </main>
  );
}
