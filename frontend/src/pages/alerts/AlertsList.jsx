import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Clock, CheckCircle, Search, Filter, Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const AlertsList = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { getNotificationsByUser, markAsRead } = useNotifications();
    const [searchTerm, setSearchTerm] = useState('');

    const userNotifications = user ? getNotificationsByUser(user.id, user.role) : [];

    const mappedAlerts = userNotifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        severity: notification.priority || 'medium',
        title: notification.title,
        message: notification.message,
        animalId: notification.cattleTag || 'N/A',
        drug: notification.medication || 'N/A',
        dueDate: notification.dueDate ? notification.dueDate.split('T')[0] : null,
        timestamp: notification.timestamp ? new Date(notification.timestamp).toLocaleString() : '',
        status: notification.read ? 'resolved' : 'active',
        farmLocation: (notification.relatedData && (notification.relatedData.farmName || notification.relatedData.farm)) || 'All Barns',
        prescriptionId: notification.problemId || notification.treatmentId || null,
        veterinarian: (notification.relatedData && notification.relatedData.veterinarianName) || 'System Alert'
    }));

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'status-danger';
            case 'high': return 'status-danger';
            case 'medium': return 'status-warning';
            case 'low': return 'status-info';
            default: return 'status-info';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'withdrawal_alert':
            case 'withdrawal':
                return <Clock className="w-5 h-5 text-warning"/>;
            case 'prescription_withdrawal':
            case 'prescription_given':
                return <AlertTriangle className="w-5 h-5 text-destructive"/>;
            case 'compliance_alert':
            case 'compliance':
                return <AlertTriangle className="w-5 h-5 text-destructive"/>;
            default:
                return <AlertTriangle className="w-5 h-5"/>;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'status-warning';
            case 'acknowledged': return 'status-info';
            case 'resolved': return 'status-success';
            default: return 'status-info';
        }
    };

    const formatAlertType = (type) => {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const filteredAlerts = mappedAlerts.filter(alert => {
        const query = searchTerm.toLowerCase();
        return (
            (alert.title && alert.title.toLowerCase().includes(query)) ||
            (alert.message && alert.message.toLowerCase().includes(query)) ||
            (alert.animalId && alert.animalId.toLowerCase().includes(query)) ||
            (alert.drug && alert.drug.toLowerCase().includes(query)) ||
            (alert.type && alert.type.toLowerCase().includes(query))
        );
    });

    const activeCount = mappedAlerts.filter(a => a.status === 'active').length;
    const highPriorityCount = mappedAlerts.filter(a => a.status === 'active' && (a.severity === 'high' || a.severity === 'critical')).length;
    const withdrawalCount = mappedAlerts.filter(a => a.type === 'withdrawal_alert').length;
    const prescriptionCount = mappedAlerts.filter(a => a.type === 'prescription_given' || a.type === 'prescription_withdrawal').length;
    const resolvedCount = mappedAlerts.filter(a => a.status === 'resolved').length;

    return (<div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('alertsList.title')}</h1>
          <p className="text-muted-foreground">{t('alertsList.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2"/>
            {t('alertsList.filter')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                <Input 
                  placeholder="Search alerts by animal, drug, or type..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.highPriority')}</p>
                <p className="text-2xl font-bold text-foreground">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.withdrawalAlerts')}</p>
                <p className="text-2xl font-bold text-foreground">{withdrawalCount}</p>
              </div>
              <Clock className="w-8 h-8 text-warning"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.prescriptionWithdrawals')}</p>
                <p className="text-2xl font-bold text-foreground">{prescriptionCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('alertsList.summary.resolvedToday')}</p>
                <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2"/>
            {t('alertsList.allAlerts')}
          </CardTitle>
          <CardDescription>{t('alertsList.allAlertsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30 text-success" />
                <p className="font-semibold text-lg">No alerts or notifications</p>
                <p className="text-sm">Everything is currently in compliance status.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (<div key={alert.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-foreground">{t(alert.title)}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {t(alert.severity)}
                          </Badge>
                          <Badge variant="outline">
                            {t(formatAlertType(alert.type))}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{t(alert.message)}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">{t('Animal')}:</span> {alert.animalId}
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">{t('Drug')}:</span> {t(alert.drug)}
                          </div>
                          {alert.dueDate && (<div>
                              <span className="font-medium text-muted-foreground">{t('Due Date')}:</span> {alert.dueDate}
                            </div>)}
                          <div>
                            <span className="font-medium text-muted-foreground">{t('Location')}:</span> {t(alert.farmLocation)}
                          </div>
                          {alert.prescriptionId && (<div>
                              <span className="font-medium text-muted-foreground">Reference Case:</span> {alert.prescriptionId}
                            </div>)}
                          {alert.veterinarian && (<div>
                              <span className="font-medium text-muted-foreground">Prescribed by:</span> {alert.veterinarian}
                            </div>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    <div className="flex space-x-2">
                      {alert.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                          <CheckCircle className="w-4 h-4 mr-1"/>
                          {t('alertsList.buttons.acknowledge')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>))
            )}
          </div>
        </CardContent>
      </Card>
    </div>);
};
export default AlertsList;
