import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { pregnancyId, subscription } = await req.json();
  if (!subscription?.endpoint)
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  /* de-dupe on endpoint */
  await supabase.from("push_subscriptions")
    .delete().eq("subscription->>endpoint", subscription.endpoint);
  const { error } = await supabase.from("push_subscriptions")
    .insert({ pregnancy_id: pregnancyId || null, subscription });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
