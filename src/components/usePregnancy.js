"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

/* Loads (or creates) the mother's pregnancy row.
   MVP identity: the row id is kept in localStorage.
   Swap for Supabase Auth user_id before public launch. */
export default function usePregnancy() {
  const [pregnancy, setPregnancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready] = useState(!!supabase);

  const load = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    const id = typeof window !== "undefined" && localStorage.getItem("mj_pregnancy_id");
    if (id) {
      const { data } = await supabase.from("pregnancies").select("*").eq("id", id).single();
      if (data) setPregnancy(data);
      else localStorage.removeItem("mj_pregnancy_id");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (mother_name, lmp) => {
    const { data, error } = await supabase
      .from("pregnancies").insert({ mother_name, lmp }).select().single();
    if (!error && data) {
      localStorage.setItem("mj_pregnancy_id", data.id);
      setPregnancy(data);
    }
    return { data, error };
  };

  return { pregnancy, loading, ready, create, reload: load };
}
