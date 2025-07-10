import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Components/theme-provider";
import { Nav } from "@/Components/Nav";
import Footer from "@/Components/footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "IMPHNEN | Ingin Menjadi Programmer Handal Namun Enggan Ngoding",
  description:
    "Ingin Menjadi Programmer Handal Namun Enggan Ngoding adalah komunitas perkumpulan sepuh-sepuh yang pura-pura malas ngoding, padahal jago banget.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} antialiased`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <div className="h-screen">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
