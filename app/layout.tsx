import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omoway — OMO X",
  description:
    "Intelligent EV mobility — embodied AI and self-balancing motorcycle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll>
          <SiteHeader />
          <div className="pt-16">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
