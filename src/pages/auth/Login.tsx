import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Stethoscope } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const Login = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    organization: '',
    licenseNumber: '',
    farmId: ''
  });

  const { login, register, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      toast({
        title: t('loginSuccessful'),
        description: t('welcomeBack', { role }),
        variant: "sky"
      });
    } catch (error) {
      toast({
        title: t('loginFailed'),
        description: error instanceof Error ? error.message : t('invalidCredentials'),
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        name: registerData.name,
        role,
        organization: registerData.organization,
        licenseNumber: role === 'veterinarian' ? registerData.licenseNumber : undefined,
        farmId: role === 'farmer' ? registerData.farmId : undefined,
      });
      toast({
        title: t('registrationSuccessful'),
        description: t('accountCreated'),
      });
    } catch (error) {
      toast({
        title: t('registrationFailed'),
        description: error instanceof Error ? error.message : t('registrationFailed'),
        variant: "destructive",
      });
    }
  };

  const getDemoCredentials = () => {
    const demos = {
      farmer: { email: 'farmer@demo.com', password: 'demo123' },
      veterinarian: { email: 'vet@demo.com', password: 'demo123' },
      regulator: { email: 'regulator@demo.com', password: 'demo123' }
    };
    return demos[role];
  };

  const fillDemoData = () => {
    const demo = getDemoCredentials();
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold text-gradient tracking-tight">FARMTRACE</h1>
          <h5 className='text-muted-foreground mt-2 text-base'>{t('farmManagementPortal')}</h5>
          <p className="text-muted-foreground mt-2 text-base">{t('modernSecureResponsible')}</p>
        </div>

        {/* Global Language Switcher Section */}
        <LanguageSwitcher />

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle>{isRegistering ? t('createAccount') : t('signIn')}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? t('createAccountDescription')
                : t('signInDescription')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">{t('role')}</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">{t('farmer')}</SelectItem>
                    <SelectItem value="veterinarian">{t('veterinarian')}</SelectItem>
                    <SelectItem value="regulator">{t('regulator')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Fields */}
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">{t('organization')}</Label>
                    <Input
                      id="organization"
                      value={registerData.organization}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, organization: e.target.value }))}
                      required
                    />
                  </div>
                  {role === 'veterinarian' && (
                    <div className="space-y-2">
                      <Label htmlFor="license">{t('licenseNumber')}</Label>
                      <Input
                        id="license"
                        value={registerData.licenseNumber}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                  {role === 'farmer' && (
                    <div className="space-y-2">
                      <Label htmlFor="farmId">{t('farmId')}</Label>
                      <Input
                        id="farmId"
                        value={registerData.farmId}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, farmId: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Demo Data Helper */}
              {!isRegistering && (
                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>{t('demoAccount')}:</strong> {getDemoCredentials().email} / {getDemoCredentials().password}
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm" 
                      onClick={fillDemoData}
                      className="ml-2 p-0 h-auto text-primary"
                    >
                      {t('useDemoData')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full btn-gradient-primary"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRegistering ? t('createAccount') : t('signIn')}
              </Button>

              {/* Switch Mode */}
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering 
                  ? t('alreadyHaveAccount') 
                  : t('dontHaveAccount')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;