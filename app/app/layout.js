export const metadata = {
  title: "Zyklus Küche",
  description: "Zyklusgerechte Ernährung, persönlich für dich.",
  manifest: "/manifest.json",
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
  themeColor: "#96496B",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          /* Sichtbarer Fokus-Ring für Tastaturnavigation - wichtig für
             Barrierefreiheit, ohne die Optik bei Maus-/Touch-Bedienung zu stören. */
          :focus-visible {
            outline: 2px solid #96496B;
            outline-offset: 2px;
            border-radius: 8px;
          }
          /* Einheitliches Antipp-Feedback für alle interaktiven Elemente -
             sorgt für ein "lebendiges", reaktionsfreudiges Gefühl statt
             statischer Flächen, die nicht erkennen lassen, dass sie geklickt
             wurden. */
          button, .tappable {
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease;
          }
          button:active, .tappable:active {
            transform: scale(0.97);
            opacity: 0.88;
          }
          button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none !important;
          }
          @media (hover: hover) {
            .tappable:hover, button:not(:disabled):hover { opacity: 0.85; }
          }
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FBF7F8" }}>
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
