import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Shield, Upload, Eye } from 'lucide-react';

const roleOptions: { value: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full access to all modules including indicator management',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    value: 'contributor',
    label: 'Data Contributor',
    description: 'Upload and manage data submissions',
    icon: <Upload className="w-6 h-6" />,
  },
  {
    value: 'viewer',
    label: 'Decision Maker',
    description: 'View dashboards and publications',
    icon: <Eye className="w-6 h-6" />,
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(selectedRole);
    if (selectedRole === 'contributor') {
      navigate('/upload');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">GoI</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Statistical Data Portal</h1>
          <p className="text-muted-foreground mt-2">
            Ministry of Statistics & Programme Implementation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login to Portal</CardTitle>
            <CardDescription>
              Select your role to access the appropriate modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="space-y-3"
            >
              {roleOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            <Button onClick={handleLogin} className="w-full" size="lg">
              Login as {roleOptions.find(r => r.value === selectedRole)?.label}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This is a Proof of Concept. No actual authentication is performed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
