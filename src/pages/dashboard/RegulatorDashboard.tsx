import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Shield, AlertTriangle, TrendingUp, Users, Database } from 'lucide-react';
import ExportReportsDialog from '@/components/forms/ExportReportsDialog';
import GenerateAnalysisDialog from '@/components/forms/GenerateAnalysisDialog';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const RegulatorDashboard = () => {
  const { treatments } = useTreatments();
  const { problems } = useCattleProblems();
  const { notifications } = useNotifications();
  const { t } = useTranslation();

  const now = new Date();
  const uniqueFarms = new Set<string>([
    ...treatments.map(t => t.farmName),
    ...problems.map(p => p.farmName),
  ]);

  const activeTreatments = treatments.filter(t =>
    (t.status === 'approved' && new Date(t.withdrawalDate) > now) || t.status === 'pending'
  );

  const reviewed = treatments.filter(t => t.status === 'approved' || t.status === 'rejected');
  const approvedCount = reviewed.filter(t => t.status === 'approved').length;
  const averageCompliance = reviewed.length > 0 ? Math.round((approvedCount / reviewed.length) * 100) : 100;

  const complianceViolations = (
    notifications.filter(n => n.type === 'compliance_alert').length +
    treatments.filter(t => t.status === 'rejected').length
  );

  const stats = {
    totalFarms: uniqueFarms.size,
    activeTreatments: activeTreatments.length,
    complianceViolations,
    averageCompliance
  };

  // Chart data
  const monthlyUsage = [
    { month: 'Jan', usage: 45, farms: 120 },
    { month: 'Feb', usage: 52, farms: 125 },
    { month: 'Mar', usage: 48, farms: 130 },
    { month: 'Apr', usage: 61, farms: 135 },
    { month: 'May', usage: 55, farms: 140 },
    { month: 'Jun', usage: 67, farms: 145 }
  ];

  const drugUsage = [
    { name: 'Penicillin', value: 35, color: '#3B82F6' },
    { name: 'Tetracycline', value: 25, color: '#10B981' },
    { name: 'Sulfonamides', value: 20, color: '#F59E0B' },
    { name: 'Others', value: 20, color: '#EF4444' }
  ];

  const relevantAlerts = notifications
    .filter(n => n.type === 'compliance_alert' || n.type === 'withdrawal_alert' || n.type === 'problem_reported')
    .slice(0, 8);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'status-danger';
      case 'medium': return 'status-warning';
      case 'low': return 'status-success';
      default: return 'status-info';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'compliance_alert': return <Shield className="w-4 h-4 text-info" />;
      case 'withdrawal_alert': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'problem_reported': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('regDashboard.title')}</h1>
          <p className="text-muted-foreground">{t('regDashboard.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <ExportReportsDialog />
          <GenerateAnalysisDialog />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('regDashboard.registeredFarms')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalFarms}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('regDashboard.activeTreatments')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeTreatments}</p>
              </div>
              <Database className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('regDashboard.violations')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.complianceViolations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('regDashboard.avgCompliance')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.averageCompliance}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Usage Trend */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {t('regDashboard.monthlyTrends')}
            </CardTitle>
            <CardDescription>{t('regDashboard.monthlyTrendsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drug Distribution */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {t('regDashboard.drugDistribution')}
            </CardTitle>
            <CardDescription>{t('regDashboard.drugDistributionDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={drugUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, x, y }) => (
                    <text x={x} y={y} fill={"hsl(var(--foreground))"} textAnchor="middle" dominantBaseline="central">
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  )}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {drugUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Usage Chart */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {t('regDashboard.farmGrowth')}
            </CardTitle>
            <CardDescription>{t('regDashboard.farmGrowthDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="farms" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {t('regDashboard.recentAlerts')}
            </CardTitle>
            <CardDescription>{t('regDashboard.recentAlertsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relevantAlerts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">{t('regDashboard.noRecentAlerts')}</div>
              ) : (
                relevantAlerts.map((n) => {
                  const farm = (n.relatedData && (n.relatedData.farmName || n.relatedData.farm)) || t('unknownFarm');
                  const severity = n.priority === 'critical' || n.priority === 'high' ? 'high' : n.priority === 'medium' ? 'medium' : 'low';
                  const dateStr = new Date(n.timestamp).toLocaleString();
                  return (
                    <div key={n.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                      {getAlertIcon(n.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{farm}</span>
                          <Badge className={getSeverityColor(severity)}>
                            {severity === 'high' ? t('severity.high') : severity === 'medium' ? t('severity.medium') : t('severity.low')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{dateStr}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegulatorDashboard;