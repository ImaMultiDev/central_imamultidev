import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Central IMA - Dashboard Personal",
  description:
    "Centro de operaciones diarias personal - Gestión de tareas, cursos, documentación y más",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-hidden lg:ml-64">
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
