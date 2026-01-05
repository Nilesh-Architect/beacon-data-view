import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  FileCheck,
  Settings,
  BookOpen,
  FileText,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'viewer'],
  },
  {
    label: 'Upload Data',
    path: '/upload',
    icon: <Upload className="w-5 h-5" />,
    roles: ['admin', 'contributor'],
  },
  {
    label: 'Submission Status',
    path: '/submissions',
    icon: <FileCheck className="w-5 h-5" />,
    roles: ['admin', 'contributor'],
  },
  {
    label: 'Indicator Management',
    path: '/indicators',
    icon: <Settings className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: 'Virtual Book',
    path: '/virtual-book',
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['admin', 'viewer'],
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: <FileText className="w-5 h-5" />,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const visibleItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              )
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
