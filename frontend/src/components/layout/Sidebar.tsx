import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";


// opciones del menú
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proyectos", href: "/projects", icon: FolderKanban },
  { name: "Todas las Tareas", href: "/tasks", icon: CheckSquare },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
          Menú
        </span>
      </div>
      {/* menú lateral */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
            activeClassName="bg-sidebar-accent text-sidebar-primary"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
