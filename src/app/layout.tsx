import './globals.css';
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

// Dynamically import Providers so it is only used on the client
const Providers = dynamic(
  () => import('@/components/providers/Providers').then(mod => mod.Providers),
  { ssr: false }
);

export const metadata = {
  title: 'Global Remit Teller',
  description: 'A teller and compliance platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
