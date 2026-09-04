import "./globals.css";
import Providers from "../components/Providers";
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><Providers>{children}</Providers></body></html>}
export const metadata={title:"Project Vault",description:"Modern project marketplace"};