import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">{t('notFound.title')}</h2>
          <p className="text-muted-foreground max-w-md">
            {t('notFound.description')}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('notFound.goBack')}
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="btn-gradient-primary flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            {t('notFound.returnHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
