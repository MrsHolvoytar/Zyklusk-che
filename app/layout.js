export const metadata = {
  title: "Zyklus Küche",
  description: "Zyklusgerechte Ernährung, persönlich für dich.",
  manifest: "/manifest.json",
  themeColor: "#7A5C2E",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zyklus Küche",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zyklus Küche" />
        <meta name="theme-color" content="#7A5C2E" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F7F3EE" }}>
        {children}
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </body>
    </html>
  );
}
