import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "./components/app-sidebar";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "./context/SiderbarContext"; // Asegúrate de importar el provider
import { SpeedInsights } from "@vercel/speed-insights/next";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El Explorador",
  description: "Interfaz para monitorear asistencia y puntuación de alumnos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <SidebarProvider> {/* ✅ Envolver todo con SidebarProvider */}
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </SidebarProvider>

        {/* Personalización del Toaster */}
        <Toaster position="bottom-right" reverseOrder={true} />
      </body>
    </html>
  );
}
