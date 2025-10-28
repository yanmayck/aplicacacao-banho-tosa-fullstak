import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Calendar as CalendarIcon,
  User as UserIcon,
  Package as PackageIcon,
  Scissors,
  BarChart,
  Menu,
  Database,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children?: React.ReactNode; // Tornando opcional para transição
}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { id: "dashboard", path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "clients", path: "/clients", label: "Clientes", icon: <Users className="h-4 w-4" /> },
    { id: "pets", path: "/pets", label: "Pets", icon: <PawPrint className="h-4 w-4" /> },
    { id: "appointments", path: "/appointments", label: "Agendamentos", icon: <CalendarIcon className="h-4 w-4" /> },
    { id: "banho-tosa", path: "/banho-tosa", label: "Banho e Tosa", icon: <Scissors className="h-4 w-4" /> },
    { id: "groomers", path: "/groomers", label: "Tosadores", icon: <UserIcon className="h-4 w-4" /> },
    { id: "packages", path: "/packages", label: "Pacotes", icon: <PackageIcon className="h-4 w-4" /> },
  ];
  
  if (isAdmin()) {
    menuItems.push({ id: "reports", path: "/reports", label: "Relatórios", icon: <BarChart className="h-4 w-4" /> });
    menuItems.push({ id: "backup", path: "/backup", label: "Backup", icon: <Database className="h-4 w-4" /> });
  }

  const isActive = (path: string) => {
    if (path === '/') {
        return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItems = () => (
    menuItems.map((item) => (
        <Link to={item.path} key={item.id}>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 ${isActive(item.path) ? 'font-semibold bg-accent' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        </Link>
      ))
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Menu */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-lg font-semibold">Pet Shop Manager</span>
        </div>
        <div className="flex-grow p-4 space-y-2">
          {renderMenuItems()}
        </div>
        <Separator />
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || user?.email} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
              <p className="text-sm text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex justify-between items-center h-16 bg-card border-b px-4">
            <span className="text-lg font-semibold">Pet Shop Manager</span>
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                    Navegue pelas opções do sistema.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    {renderMenuItems()}
                </div>
                <Separator />
                <div className="py-4">
                    <Button variant="outline" className="w-full justify-start" onClick={logout}>
                    Sair
                    </Button>
                </div>
                </SheetContent>
            </Sheet>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export { Layout };
