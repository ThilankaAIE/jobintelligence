import "./globals.css";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "JobIntelligence",
  description: "Job search + insights dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
