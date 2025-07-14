import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "KLTMINES Investment Platform",
  description: "A modern investment platform for managing your investments with real-time tracking and analytics.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KLTMINES Investment Platform',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KLTMINES Investment Platform" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Mobile viewport height fix
              function setVH() {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
              }
              
              // Set initial viewport height
              setVH();
              
              // Update on resize and orientation change
              window.addEventListener('resize', setVH);
              window.addEventListener('orientationchange', () => {
                setTimeout(setVH, 100);
              });
              
              // Prevent zoom on input focus (iOS)
              document.addEventListener('DOMContentLoaded', function() {
                const inputs = document.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                  input.addEventListener('focus', function() {
                    if (window.innerWidth <= 768) {
                      this.style.fontSize = '16px';
                    }
                  });
                });
              });
              
              // Prevent double-tap zoom
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans mobile-optimized">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="mobile-optimized">
              {children}
            </div>
            <Toaster 
              position="top-center"
              richColors
              closeButton
              duration={4000}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
