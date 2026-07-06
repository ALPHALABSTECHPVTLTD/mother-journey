"use client";
import { useEffect, useState, useCallback } from "react";
import { Save, TrendingUp } from "lucide-react";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import usePregnancy from "../../components/usePregnancy";
import BottomNav from "../../components/BottomNav";
import { supabase } from "../../lib/supabase";
import { engine } from "../../lib/engine";

const MOODS = ["😢", "😕", "😐", "🙂", "🥰"];

export default function GraphPage() {
  const { pregnancy, loading, ready } = usePregnancy();
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState("");
  const [kicks, setKicks] = useState("");
  const [mood, setMood] = useState(4);
  const [symptoms, setSymptoms] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !pregnancy) return;
    const { data } = await supabase.from("daily_logs")
      .select("*").eq("pregnancy_id", pregnancy.id)
      .order("log_date", { ascending: true }).limit(60);
    setLogs(data || []);
    const today = (data || []).find((l) => l.log_date === new Date().toISOString().slice(0, 10));
    if (today) {
      setWeight(today.weight_kg ?? ""); setKicks(today.kicks ?? "");
      setMood(today.mood ?? 4); setSymptoms(today.symptoms ?? "");
    }
  }, [pregnancy]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setSaved(false);
    await supabase.from("daily_logs").upsert({
      pregnancy_id: pregnancy.id,
      log_date: new Date().toISOString().slice(0, 10),
      weight_kg: weight === "" ? null : +weight,
      kicks: kicks === "" ? null : +kicks,
      mood, symptoms: symptoms || null,
    }, { onConflict: "pregnancy_id,log_date" });
    await load();
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!ready || loading)
    return <main style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)" }}>Loading…</main>;
  if (!pregnancy)
    return <main style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)" }}>Set up your journey on the Home tab first.</main>;

  const eng = engine(pregnancy.lmp);
  const chart = logs.map((l) => ({
    date: new Date(l.log_date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    Weight: l.weight_kg == null ? null : +l.weight_kg,
    Kicks: l.kicks,
  }));

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 18px 120px" }}>
      <header className="fade-up" style={{ marginBottom: 16 }}>
        <div className="eyebrow">Daily graph</div>
        <h1 className="serif" style={{ fontSize: 28, fontWeight: 640 }}>Your journey in numbers</h1>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 3 }}>
          Week {eng.week} · log a little every day, watch the story build
        </p>
      </header>

      <section className="glass fade-up" style={{ padding: "18px 14px 8px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14.5, margin: "0 6px 8px" }}>
          <TrendingUp size={16} color="#9B7FE8" /> Weight & kicks — last {chart.length || 0} days
        </div>
        {chart.length === 0 ? (
          <p style={{ padding: "30px 10px", textAlign: "center", fontSize: 13.5, color: "var(--ink-soft)" }}>
            No entries yet — save today's log below and your first point appears here.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chart} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(155,127,232,.18)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8B7BA3" }} />
              <YAxis yAxisId="w" tick={{ fontSize: 11, fill: "#8B7BA3" }} domain={["auto", "auto"]} />
              <YAxis yAxisId="k" orientation="right" tick={{ fontSize: 11, fill: "#8B7BA3" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #EFD9FB", fontFamily: "Outfit", fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Outfit" }} />
              <Bar yAxisId="k" dataKey="Kicks" fill="#C9B8F0" radius={[6, 6, 0, 0]} barSize={14} />
              <Line yAxisId="w" type="monotone" dataKey="Weight" stroke="#E8739A" strokeWidth={3}
                dot={{ r: 4, fill: "#E8739A", strokeWidth: 2, stroke: "#fff" }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="glass fade-up" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Today's log</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700 }}>Weight (kg)</label>
            <input className="mj" type="number" step="0.1" inputMode="decimal" placeholder="56.4"
              value={weight} onChange={(e) => setWeight(e.target.value)} style={{ marginTop: 5 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700 }}>Kicks counted</label>
            <input className="mj" type="number" inputMode="numeric" placeholder="10"
              value={kicks} onChange={(e) => setKicks(e.target.value)} style={{ marginTop: 5 }} />
          </div>
        </div>
        <label style={{ fontSize: 12, fontWeight: 700 }}>Mood</label>
        <div style={{ display: "flex", gap: 8, margin: "6px 0 12px" }}>
          {MOODS.map((m, i) => (
            <button key={m} onClick={() => setMood(i + 1)} aria-label={`Mood ${i + 1} of 5`}
              style={{ fontSize: 24, padding: "8px 10px", borderRadius: 14, cursor: "pointer", border: "none",
                background: mood === i + 1 ? "linear-gradient(135deg,#FBD5E3,#EFD9FB)" : "rgba(255,255,255,.55)",
                boxShadow: mood === i + 1 ? "0 8px 16px -6px rgba(232,115,154,.4)" : "none" }}>
              {m}
            </button>
          ))}
        </div>
        <label style={{ fontSize: 12, fontWeight: 700 }}>Symptoms / notes</label>
        <input className="mj" placeholder="e.g. mild nausea in the morning"
          value={symptoms} onChange={(e) => setSymptoms(e.target.value)} style={{ margin: "5px 0 14px" }} />
        <button className="btn btn-rose" style={{ width: "100%" }} onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save today's log"}
        </button>
      </section>
      <BottomNav />
    </main>
  );
}
