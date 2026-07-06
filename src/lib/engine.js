/* Pregnancy engine — everything derives from the LMP stored in Supabase */
export const DAY = 86400000;

export function engine(lmpISO, now = new Date()) {
  const lmp = new Date(lmpISO + "T00:00:00");
  const daysPregnant = Math.max(0, Math.floor((now - lmp) / DAY));
  const week = Math.floor(daysPregnant / 7);
  const day = daysPregnant % 7;
  const edd = new Date(lmp.getTime() + 280 * DAY);
  const daysRemaining = Math.max(0, 280 - daysPregnant);
  const progress = Math.min(100, Math.round((daysPregnant / 280) * 1000) / 10);
  const month = Math.min(9, Math.floor(daysPregnant / 30.44) + 1);
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  return { lmp, daysPregnant, week, day, edd, daysRemaining, progress, month, trimester };
}

export const fmtDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const weekDate = (lmpISO, w) =>
  new Date(new Date(lmpISO + "T00:00:00").getTime() + w * 7 * DAY);

export const SCANS = [
  { week: 5,  title: "Viability Scan" },
  { week: 7,  title: "Heartbeat Scan" },
  { week: 12, title: "NT Scan" },
  { week: 20, title: "Anomaly Scan" },
  { week: 28, title: "Growth Scan" },
  { week: 32, title: "Doppler Scan" },
  { week: 36, title: "Final Wellbeing Scan" },
  { week: 40, title: "Expected Delivery" },
];

const SIZES = [[4,"a poppy seed"],[5,"a sesame seed"],[6,"a lentil"],[7,"a blueberry"],
[8,"a raspberry"],[9,"a cherry"],[10,"a strawberry"],[12,"a lime"],[14,"a lemon"],
[16,"an avocado"],[20,"a banana"],[24,"an ear of corn"],[28,"an aubergine"],
[32,"a coconut"],[36,"a papaya"],[40,"a little pumpkin"]];
export const babySize = (w) => { let s = SIZES[0][1]; for (const [k, v] of SIZES) if (w >= k) s = v; return s; };
