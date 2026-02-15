// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: {
//     default: "2026 AIA Boys Basketball Open State Championship",
//     template: "%s | AZHS Bracket",
//   },
//   description:
//     "Predict the matchups between the top 32 teams in Arizona high school basketball, and who will take home the trophy in Arizona Veterans Memorial Coliseum on March 7th! Fill out your bracket and compete against others to see who can have the most accurate bracket.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Page content */}
//         <div style={{ flex: 1 }}>{children}</div>

//         {/* Global footer credits */}
//         <footer
//           style={{
//             borderTop: "1px solid rgba(255,255,255,0.10)",
//             background: "rgba(0,0,0,0.35)",
//             padding: "14px 18px",
//             color: "rgba(255,255,255,0.80)",
//             fontSize: 13,
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 1100,
//               margin: "0 auto",
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 10,
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ lineHeight: "18px" }}>
//               Software developed by{" "}
//               <b style={{ color: "#fff" }}>Charles Richards</b> (ASU CS student)
//               <span style={{ opacity: 0.7 }}> · </span>
//               <a
//                 href="https://github.com/charlierichards13"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 GitHub
//               </a>
//               <span style={{ opacity: 0.7 }}> · </span>
//               <a
//                 href="https://www.instagram.com/charlie.richards13/?hl=en"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 Instagram
//               </a>
//             </div>

//             <div style={{ lineHeight: "18px" }}>
//               Graphic designs by{" "}
//               <a
//                 href="https://www.instagram.com/beckettvisuals/"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 Beckett Visuals
//               </a>
//             </div>
//           </div>
//         </footer>
//       </body>
//     </html>
//   );
// }
// Created by Charles Richards ASU CS 2028

// Created by Charles Richards ASU CS 2028


// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "2026 AIA Boys Basketball Open State Championship",
//   description:
//     "Predict the matchups between the top 32 teams in Arizona high school basketball, and who will take home the trophy in Arizona Veterans Memorial Coliseum on March 7th! Fill out your bracket and compete against others to see who can have the most accurate bracket.",
// };

// // Keep in sync with footer padding below
// const FOOTER_HEIGHT = 58;

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         style={{
//           minHeight: "100vh",
//           paddingBottom: FOOTER_HEIGHT, // prevents content from hiding behind fixed footer
//         }}
//       >
//         {children}

//         {/* Fixed footer credits */}
//         <footer
//           style={{
//             position: "fixed",
//             left: 0,
//             right: 0,
//             bottom: 0,
//             height: FOOTER_HEIGHT,
//             display: "flex",
//             alignItems: "center",
//             borderTop: "1px solid rgba(255,255,255,0.10)",
//             background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(10px)",
//             padding: "0 18px",
//             color: "rgba(255,255,255,0.80)",
//             fontSize: 13,
//             zIndex: 50,
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 1100,
//               width: "100%",
//               margin: "0 auto",
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 10,
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ lineHeight: "18px" }}>
//               Software developed by{" "}
//               <b style={{ color: "#fff" }}>Charles Richards</b> (ASU CS student)
//               <span style={{ opacity: 0.7 }}> · </span>
//               <a
//                 href="https://github.com/charlierichards13"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 GitHub
//               </a>
//               <span style={{ opacity: 0.7 }}> · </span>
//               <a
//                 href="https://www.instagram.com/charlie.richards13/?hl=en"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 Instagram
//               </a>
//             </div>

//             <div style={{ lineHeight: "18px" }}>
//               Graphic designs by{" "}
//               <a
//                 href="https://www.instagram.com/beckettvisuals/"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff", textDecoration: "underline" }}
//               >
//                 Beckett Visuals
//               </a>
//             </div>
//           </div>
//         </footer>
//       </body>
//     </html>
//   );
// }
// // Created by Charles Richards ASU CS 2028



import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026 AIA Boys Basketball Open State Championship",
  description:
    "Predict the matchups between the top 32 teams in Arizona high school basketball, and who will take home the trophy in Arizona Veterans Memorial Coliseum on March 7th! Fill out your bracket and compete against others to see who can have the most accurate bracket.",
};

// Keep in sync with footer padding below
const FOOTER_HEIGHT = 58;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          minHeight: "100vh",
          paddingBottom: FOOTER_HEIGHT, // prevents content from hiding behind fixed footer
        }}
      >
        {children}

        {/* Fixed footer credits */}
        <footer
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: FOOTER_HEIGHT,
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            padding: "0 18px",
            color: "rgba(255,255,255,0.80)",
            fontSize: 13,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ lineHeight: "18px" }}>
              <Link
                href="/"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 13 }}>
                  🏠
                </span>
                <b>Home</b>
              </Link>

              <span style={{ opacity: 0.7 }}> · </span>

              Software developed by{" "}
              <b style={{ color: "#fff" }}>Charles Richards</b> (ASU CS student)
              <span style={{ opacity: 0.7 }}> · </span>
              <a
                href="https://github.com/charlierichards13"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                GitHub
              </a>
              <span style={{ opacity: 0.7 }}> · </span>
              <a
                href="https://www.instagram.com/charlie.richards13/?hl=en"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                Instagram
              </a>
            </div>

            <div style={{ lineHeight: "18px" }}>
              Graphic designs by{" "}
              <a
                href="https://www.instagram.com/beckettvisuals/"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                Beckett Visuals
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
// Created by Charles Richards ASU CS 2028
