import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Central IMA - Dashboard Personal",
  description:
    "Centro de operaciones diarias personal - Gestión de tareas, cursos, documentación y más",
  keywords: [
    "dashboard",
    "productividad",
    "gestión",
    "tareas",
    "cursos",
    "documentación",
    "calendario",
    "desarrollo",
  ],
  authors: [{ name: "Imanol MU", url: "https://github.com/ImaMultiDev" }],
  creator: "Imanol MU",
  publisher: "ImaMultiDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://central-imamultidev.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Central IMA - Dashboard Personal",
    description:
      "Centro de operaciones diarias personal - Gestión de tareas, cursos, documentación y más",
    url: "https://central-imamultidev.vercel.app",
    siteName: "Central IMA",
    images: [
      {
        url: "/icon/icon_512x512.png",
        width: 512,
        height: 512,
        alt: "Central IMA Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Central IMA - Dashboard Personal",
    description:
      "Centro de operaciones diarias personal - Gestión de tareas, cursos, documentación y más",
    images: ["/icon/icon_512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon/icon_16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/icon_48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/icon/icon_180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/icon/icon_192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/icon_512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon/icon_180x180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Central IMA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
