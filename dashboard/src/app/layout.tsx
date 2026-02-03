import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'LifeOS World Dashboard',
  description: 'Manage the LifeOS 2030 world canon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 overflow-auto flex justify-center">
            <div className="w-full max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
