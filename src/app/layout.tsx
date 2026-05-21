import type { Metadata } from "next";
import { OneSignalInit } from "@/components/onesignal/OneSignalInit";
import { TopNav } from "@/components/nav/TopNav";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wair — For you, by you.",
  description:
    "Fashion discovery curated for you. Swipe daily picks, build your wishlist, and find vintage and streetwear nearby.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} font-serif antialiased`}>
        <OneSignalInit />
        <TopNav />
        <div className="page-with-nav">{children}</div>
      </body>
    </html>
  );
}
