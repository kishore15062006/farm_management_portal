import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from '@/hooks/useTranslation';

const ComplianceView = () => {
    const { notifications } = useNotifications();
    const { t } = useTranslation();

    const relevantAlerts = notifications.filter(
        n => n.type === 'compliance_alert' || n.type === 'withdrawal_alert' || n.type === 'problem_reported'
    );

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
            case 'high': return 'status-danger';
            case 'medium': return 'status-warning';
            case 'low': return 'status-success';
            default: return 'status-info';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'compliance_alert': return <Shield className="w-5 h-5 text-info" />;
            case 'withdrawal_alert': return <AlertTriangle className="w-5 h-5 text-warning" />;
            case 'problem_reported': return <ShieldAlert className="w-5 h-5 text-destructive" />;
            default: return <AlertTriangle className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Compliance Oversight</h1>
                <p className="text-muted-foreground">Monitor real-time compliance issues, withdrawal period violations, and clinical flags across registered farms.</p>
            </div>

            {/* Compliance Alerts Logs */}
            <Card className="card-elevated">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <ShieldAlert className="w-5 h-5 mr-2 text-destructive" />
                        Compliance & Withdrawal Alerts Log ({relevantAlerts.length})
                    </CardTitle>
                    <CardDescription>Live feed of alerts triggered automatically by the system or reported by clinical veterinarians.</CardDescription>
                </CardHeader>
                <CardContent>
                    {relevantAlerts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30 text-success" />
                            <p className="text-lg font-semibold">No Compliance Alerts Outstanding</p>
                            <p className="text-sm">All farms are currently operating within compliance limits.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {relevantAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:shadow-md transition-all duration-200 bg-card">
                                    <div className="p-2 bg-muted rounded-lg border border-border mt-0.5">
                                        {getAlertIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                            <h3 className="font-semibold text-sm text-foreground truncate">{alert.title}</h3>
                                            <Badge className={getSeverityColor(alert.priority)}>
                                                {alert.priority || 'medium'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                                        
                                        <div className="flex items-center space-x-4 text-[10px] text-muted-foreground">
                                            <span><strong>{t('common.date')}:</strong> {new Date(alert.timestamp).toLocaleString()}</span>
                                            {alert.cattleTag && (
                                                <span><strong>Cattle ID:</strong> {alert.cattleTag}</span>
                                            )}
                                            {alert.medication && (
                                                <span><strong>Medication:</strong> {alert.medication}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ComplianceView;
