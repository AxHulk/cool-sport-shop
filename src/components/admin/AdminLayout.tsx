import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import AdminAuth from './AdminAuth';
import { isAdminAuthed } from '@/lib/adminApi';

const AdminLayout = () => {
  const [authed, setAuthed] = useState(() => isAdminAuthed());
  const navigate = useNavigate();

  useEffect(() => {
    if (authed && window.location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authed, navigate]);

  if (!authed) {
    return <AdminAuth onAuth={() => setAuthed(true)} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-medium text-muted-foreground">Strelka Admin</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
