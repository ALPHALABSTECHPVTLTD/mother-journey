import { GLOBAL_CSS } from "../lib/theme";
import SWRegister from "../components/SWRegister";

export const metadata = {
  title: "Mother Journey — Pregnancy Tracker",
  description: "Track your pregnancy week by week with a living 3D womb, timeline and daily logs.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mother Journey" },
};

export const viewport = {
  themeColor: "#E8739A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body>
        <SWRegister />
        {children}
      </body>
    </html>
  );
}
