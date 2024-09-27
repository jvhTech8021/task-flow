import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CopilotProvider } from '@/app/context/CopilotContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Custom App',
  description: 'Copilot Custom App Example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CopilotProvider>
        <body className={inter.className}>{children}</body>
      </CopilotProvider>
    </html>
  );
}
