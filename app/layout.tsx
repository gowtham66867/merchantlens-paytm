import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MerchantLens | Every story, a clearer problem', description: 'Voice interviews. Traceable evidence. Merchant-approved problem briefs.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
