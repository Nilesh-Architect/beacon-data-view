import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  const roleLabels = {
    admin: 'Administrator',
    contributor: 'Data Contributor',
    viewer: 'Decision Maker',
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm">GoI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Statistical Data Portal</h1>
              <p className="text-xs text-primary-foreground/80">Ministry of Statistics & Programme Implementation</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {roleLabels[user.role]}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
