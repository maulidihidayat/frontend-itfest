// src/app/layout.tsx
import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Components/theme-provider";

// const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
//   variable: "--font-poppins",
// });

export const metadata: Metadata = {
  title: "MINDSSLIDE.AI",
  description:
    "PDF to PowerPoint Converter by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`$poppins`}>
      
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
          <div className="min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
