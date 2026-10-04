import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const base = import.meta.env.BASE_URL;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "خديجة خريبكة — منتجات بلدية | Khadija" },
      {
        name: "description",
        content: "خديجة، سوق خريبكة: لبن وكسكس وعسل وزيوت ومنتجات المزرعة. تصفح الإعلانات وراسل صاحبة المزرعة.",
      },
      { name: "theme-color", content: "#1b5e45" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "خديجة خريبكة · Khadija — Le goût de la maison" },
      { property: "og:description", content: "Lben, couscous, miel et produits du terroir à Khouribga. Contactez Khadija sur WhatsApp pour confirmer votre commande." },
      { property: "og:image", content: "https://khadija-khouribga.azurewebsites.net/media/couscous.jpg" },
      { property: "og:url", content: "https://khadija-khouribga.azurewebsites.net/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: `${base}favicon.svg` },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Fraunces:opsz,wght@9..144,560;9..144,680&family=Outfit:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: `${base}__grok/manifest.webmanifest` },
      { rel: "apple-touch-icon", href: `${base}__grok/icon-180.png` },
    ],
  }),
  component: () => (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script src={`${base}theme.js`} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
