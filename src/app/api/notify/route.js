import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export const dynamic = "force-dynamic";

const SIZES = [[4,"a poppy seed"],[5,"a sesame seed"],[6,"a lentil"],[7,"a blueberry"],
[8,"a raspberry"],[9,"a cherry"],[10,"a strawberry"],[12,"a lime"],[14,"a lemon"],
[16,"an avocado"],[20,"a banana"],[24,"an ear of corn"],[28,"an aubergine"],
[32,"a coconut"],[36,"a papaya"],[40,"a little pumpkin"]];
const babySize = (w) => { let s = SIZES[0][1]; for (const [k, v] of SIZES) if (w >= k) s = v; return s; };

async function send(custom) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("id, subscription, pregnancy_id, pregnancies(lmp, mother_name)");
  let sent = 0, removed = 0;
  for (const row of subs || []) {
    let payload = custom;
    if (!payload) {
      /* personalised daily message from the timeline */
      const lmp = row.pregnancies?.lmp;
      if (lmp) {
        const days = Math.floor((Date.now() - new Date(lmp + "T00:00:00")) / 86400000);
        const w = Math.floor(days / 7), d = days % 7;
        payload = {
          title: `Week ${w}, day ${d} 💕`,
          body: `Baby is about the size of ${babySize(w)} today. See the living womb & log your day!`,
          url: "/womb",
        };
      } else {
        payload = { title: "Mother Journey 💕", body: "See how your baby is growing today.", url: "/womb" };
      }
    }
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify(payload));
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", row.id);
        removed++;
      }
    }
  }
  return { sent, removed };
}

/* GET  /api/notify?key=SECRET      -> personalised daily push (used by Vercel Cron)
   POST /api/notify {key,title,body,url} -> custom broadcast */
export async function GET(req) {
  const key = new URL(req.url).searchParams.get("key");
  const isCron = req.headers.get("user-agent")?.includes("vercel-cron");
  if (!isCron && key !== process.env.NOTIFY_SECRET)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await send(null));
}

export async function POST(req) {
  const { key, title, body, url } = await req.json();
  if (key !== process.env.NOTIFY_SECRET)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json(await send({ title, body, url: url || "/" }));
}
