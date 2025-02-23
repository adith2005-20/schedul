import { Geist, Geist_Mono, Space_Grotesk  } from "next/font/google";

import "./globals.css";

const spaceGrotesk= Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets:["latin"],
  weight:["400","600"]
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Schedul -  Visualisation made easy",
  description: "Visualise CPU scheduling algorithms easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased font-lora`}
      >
        {children}
      </body>
    </html>
  );
}
