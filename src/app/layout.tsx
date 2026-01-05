import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magistr Hazırlığı - İmtahan Simulyatoru",
  description: "Magistraturaya hazırlıq üçün sürətli və effektiv imtahan simulyatoru. Test və yazılı imtahan rejimləri.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  themeColor: "#020817",
  openGraph: {
    title: "Magistr Hazırlığı - İmtahan Simulyatoru",
    description: "Sürətli imtahan simulyasiyası ilə magistraturaya hazırlaşın.",
    images: ["/logo.png"],
    siteName: "Magistr Hazırlığı",
    locale: "az_AZ",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#020817",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
