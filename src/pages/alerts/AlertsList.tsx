import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Clock, CheckCircle, Search, Filter, Eye, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AlertsList = () => {
  const { t } = useTranslation();
  // Mock alerts data
  const alerts = [
    {
      id: 1,
      type: 'withdrawal',
      severity: 'high',
      title: 'Withdrawal Period Ending',
      message: 'Cattle #247 withdrawal period for Amoxicillin treatment ends in 2 days',
      animalId: 'Cattle #247',
      drug: 'Amoxicillin',
      dueDate: '2024-01-22',
      timestamp: '2024-01-20 10:30',
      status: 'active',
      farmLocation: 'Barn 1, Section A'
    },
    {
      id: 2,
      type: 'prescription_withdrawal',
      severity: 'critical',
      title: 'Prescription Withdrawal Alert',
      message: 'Cattle #156 prescribed Enrofloxacin - withdrawal period ends in 1 day. Animal must not be slaughtered until 2024-01-23',
      animalId: 'Cattle #156',
      drug: 'Enrofloxacin',
      dueDate: '2024-01-23',
      timestamp: '2024-01-20 14:30',
      status: 'active',
      farmLocation: 'Barn 2, Section B',
      prescriptionId: 'PRES-2024-001',
      veterinarian: 'Dr. Sarah Wilson'
    },
    {
      id: 3,
      type: 'prescription_withdrawal',
      severity: 'high',
      title: 'Prescription Withdrawal Warning',
      message: 'Pig #89 prescribed Oxytetracycline - 3 days remaining in withdrawal period',
      animalId: 'Pig #89',
      drug: 'Oxytetracycline',
      dueDate: '2024-01-25',
      timestamp: '2024-01-20 11:15',
      status: 'active',
      farmLocation: 'Pig House 1',
      prescriptionId: 'PRES-2024-002',
      veterinarian: 'Dr. Michael Brown'
    },
    {
      id: 4,
      type: 'compliance',
      severity: 'medium',
      title: 'Missing Documentation',
      message: 'Treatment record for Pig #103 is missing veterinarian approval signature',
      animalId: 'Pig #103',
      drug: 'Oxytetracycline',
      dueDate: '2024-01-25',
      timestamp: '2024-01-19 14:15',
      status: 'active',
      farmLocation: 'Pig House 2'
    },
    {
      id: 5,
      type: 'prescription_withdrawal',
      severity: 'medium',
      title: 'Prescription Withdrawal Active',
      message: 'Sheep #45 prescribed Penicillin - currently in withdrawal period until 2024-01-28',
      animalId: 'Sheep #45',
      drug: 'Penicillin',
      dueDate: '2024-01-28',
      timestamp: '2024-01-20 09:00',
      status: 'active',
      farmLocation: 'Pasture A',
      prescriptionId: 'PRES-2024-003',
      veterinarian: 'Dr. Sarah Wilson'
    },
    {
      id: 6,
      type: 'dosage',
      severity: 'low',
      title: 'Dosage Recommendation',
      message: 'Consider reducing Penicillin dosage for similar cases based on recent efficacy data',
      animalId: 'General',
      drug: 'Penicillin G',
      dueDate: null,
      timestamp: '2024-01-18 09:45',
      status: 'acknowledged',
      farmLocation: 'All Locations'
    },
    {
      id: 7,
      type: 'withdrawal',
      severity: 'medium',
      title: 'Withdrawal Period Active',
      message: 'Sheep #89 is in withdrawal period, slaughter prohibited until 2024-01-24',
      animalId: 'Sheep #89',
      drug: 'Sulfamethoxazole',
      dueDate: '2024-01-24',
      timestamp: '2024-01-17 16:20',
      status: 'active',
      farmLocation: 'Pasture C'
    },
    {
      id: 8,
      type: 'feed_additive',
      severity: 'high',
      title: 'Feed Additive Expiring',
      message: 'Chlortetracycline medicated feed batch CT2024-001 withdrawal period starts tomorrow',
      animalId: 'Pigs Barn 2',
      drug: 'Chlortetracycline',
      dueDate: '2024-01-21',
      timestamp: '2024-01-20 08:00',
      status: 'active',
      farmLocation: 'Pig Barn 2'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'status-danger';
      case 'high': return 'status-danger';
      case 'medium': return 'status-warning';
      case 'low': return 'status-info';
      default: return 'status-info';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'prescription_withdrawal':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'compliance':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'dosage':
        return <CheckCircle className="w-5 h-5 text-info" />;
      case 'feed_additive':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-warning';
      case 'acknowledged': return 'status-info';
      case 'resolved': return 'status-success';
      default: return 'status-info';
    }
  };

  const formatAlertType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('alertsList.title')}</h1>
          <p className="text-muted-foreground">{t('alertsList.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />{t('alertsList.filter')}</Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search alerts by animal, drug, or type..." 
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.activeAlerts')}</p>
                <p className="text-2xl font-bold text-foreground">6</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.highPriority')}</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.withdrawalAlerts')}</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.prescriptionWithdrawals')}</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.resolvedToday')}</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />{t('alertsList.allAlerts')}</CardTitle>
          <CardDescription>{t('alertsList.allAlertsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity === 'critical' ? t('severity.critical') : alert.severity === 'high' ? t('severity.high') : alert.severity === 'medium' ? t('severity.medium') : t('severity.low')}
                        </Badge>
                        <Badge variant="outline">
                          {formatAlertType(alert.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Animal:</span> {alert.animalId}
                        </div>
                        <div>
                          <span className="font-medium">Drug:</span> {alert.drug}
                        </div>
                        {alert.dueDate && (
                          <div>
                            <span className="font-medium">Due Date:</span> {alert.dueDate}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Location:</span> {alert.farmLocation}
                        </div>
                        {alert.prescriptionId && (
                          <div>
                            <span className="font-medium">Prescription ID:</span> {alert.prescriptionId}
                          </div>
                        )}
                        {alert.veterinarian && (
                          <div>
                            <span className="font-medium">Prescribed by:</span> {alert.veterinarian}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {t(['alertsList','statuses', alert.status].join('.'))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />{t('alertsList.buttons.view')}</Button>
                    {alert.status === 'active' && (
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />{t('alertsList.buttons.acknowledge')}</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsList;
