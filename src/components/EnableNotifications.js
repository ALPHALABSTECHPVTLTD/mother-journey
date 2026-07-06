"use client";
import { useState, useEffect } from "react";
import { Bell, BellRing } from "lucide-react";

function b64ToUint8(base64) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const b = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function EnableNotifications({ pregnancyId }) {
  const [state, setState] = useState("idle"); // idle | on | denied | unsupported | busy
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return setState("unsupported");
    if (Notification.permission === "granted") setState("on");
    if (Notification.permission === "denied") setState("denied");
  }, []);

  const enable = async () => {
    try {
      setState("busy");
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return setState(perm === "denied" ? "denied" : "idle");
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: b64ToUint8(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregnancyId, subscription: sub }),
      });
      setState("on");
    } catch (e) {
      console.error(e);
      setState("idle");
    }
  };

  if (state === "unsupported")
    return <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>Push needs Chrome/Edge, or iOS 16.4+ after “Add to Home Screen”.</p>;
  if (state === "on")
    return <span className="chip" style={{ background: "rgba(143,216,192,.25)", color: "#3E9E7C" }}><BellRing size={14} /> Daily reminders on</span>;
  if (state === "denied")
    return <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>Notifications are blocked — allow them in browser settings.</p>;
  return (
    <button className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 13.5 }} onClick={enable} disabled={state === "busy"}>
      <Bell size={15} /> {state === "busy" ? "Enabling…" : "Enable daily reminders"}
    </button>
  );
}
