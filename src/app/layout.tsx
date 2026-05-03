import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Script
          id="travelpayouts-drive"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://tpembars.com/NTI0ODE4.js?t=524818';
                document.head.appendChild(script);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}