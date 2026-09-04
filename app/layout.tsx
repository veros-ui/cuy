import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "kingdapa-hiz",
  description: "Modern project marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
