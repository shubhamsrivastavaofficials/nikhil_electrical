import type { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar';
import MobileTopbar from '@/components/admin/MobileTopbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-900">
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: '#12181F', color: '#EDF1F7' } }}
      />
      <Sidebar />
      <MobileTopbar />
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
