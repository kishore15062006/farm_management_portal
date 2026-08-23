import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Package, AlertTriangle, TrendingUp, Clock, FileText, Pill, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useFeedAdditives } from '@/contexts/FeedAdditiveContext';

const FarmerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getProblemsByFarmer } = useCattleProblems();
    const { getTreatmentsByFarmer, getApprovedTreatments } = useTreatments();
    const { getActiveWithdrawalAlerts, getNotificationsByUser } = useNotifications();
    const { getFeedAdditivesByFarmer } = useFeedAdditives();
    const { t } = useTranslation();

    const reportedProblems = user ? getProblemsByFarmer(user.id) : [];
    const farmerTreatments = user ? getTreatmentsByFarmer(user.id) : [];
    const approvedTreatments = user ? getApprovedTreatments(user.id) : [];
    const feedAdditives = user ? getFeedAdditivesByFarmer(user.id) : [];
    const withdrawalAlerts = user ? getActiveWithdrawalAlerts(user.id) : [];
    const allNotifications = user ? getNotificationsByUser(user.id, 'farmer') : [];

    const reviewedFarmerTreatments = farmerTreatments.filter(t => t.status === 'approved' || t.status === 'rejected');
    const approvedFarmerCount = reviewedFarmerTreatments.filter(t => t.status === 'approved').length;
    const complianceScore = reviewedFarmerTreatments.length > 0 
        ? Math.round((approvedFarmerCount / reviewedFarmerTreatments.length) * 100) 
        : 100;

    // Dynamic stats
    const stats = {
        activeTreatments: approvedTreatments.length,
        pendingApprovals: farmerTreatments.filter(t => t.status === 'pending').length,
        feedAdditivesUsed: feedAdditives.length,
        complianceScore,
        reportedProblems: reportedProblems.length,
        prescriptionsReceived: reportedProblems.filter(p => p.status === 'prescribed').length
    };

    const getTreatmentStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'status-success';
            case 'pending': return 'status-warning';
            case 'rejected': return 'status-danger';
            default: return 'status-info';
        }
    };

    const alerts = [
        ...withdrawalAlerts.map(alert => ({
            id: alert.id,
            type: alert.priority === 'critical' ? 'critical' : alert.priority === 'high' ? 'warning' : 'info',
            message: alert.message,
            date: alert.dueDate || alert.timestamp.split('T')[0],
            title: alert.title,
            cattleTag: alert.cattleTag,
            medication: alert.medication,
            priority: alert.priority
        })),
        ...allNotifications
            .filter(n => n.type !== 'withdrawal_alert' && !n.read)
            .map(notification => ({
                id: notification.id,
                type: notification.priority === 'high' ? 'warning' : 'info',
                message: notification.message,
                date: notification.timestamp.split('T')[0],
                title: notification.title,
                cattleTag: notification.cattleTag || undefined,
                medication: notification.medication || undefined,
                priority: notification.priority
            }))
    ];

    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive"/>;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-warning"/>;
            case 'info': return <Clock className="w-4 h-4 text-info"/>;
            default: return <AlertTriangle className="w-4 h-4"/>;
        }
    };

    const getAlertBgColor = (type) => {
        switch (type) {
            case 'critical': return 'bg-destructive/10 border-destructive/20';
            case 'warning': return 'bg-warning/10 border-warning/20';
            case 'info': return 'bg-info/10 border-info/20';
            default: return 'bg-muted/50 border-border';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'prescribed': return 'status-success';
            case 'under_review': return 'status-warning';
            case 'pending': return 'status-info';
            case 'resolved': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'status-danger';
            case 'high': return 'status-warning';
            case 'medium': return 'status-info';
            case 'low': return 'status-success';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (<div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('farmerDashboard.title')}</h1>
          <p className="text-muted-foreground">{t('farmerDashboard.subtitle')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.activeTreatments')}</p>
                <p className="text-xl font-bold text-foreground">{stats.activeTreatments}</p>
              </div>
              <Calendar className="w-6 h-6 text-primary"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.pendingApprovals')}</p>
                <p className="text-xl font-bold text-foreground">{stats.pendingApprovals}</p>
              </div>
              <Clock className="w-6 h-6 text-warning"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.feedAdditives')}</p>
                <p className="text-xl font-bold text-foreground">{stats.feedAdditivesUsed}</p>
              </div>
              <Package className="w-6 h-6 text-secondary"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.problemsReported')}</p>
                <p className="text-xl font-bold text-foreground">{stats.reportedProblems}</p>
              </div>
              <FileText className="w-6 h-6 text-info"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.prescriptions')}</p>
                <p className="text-xl font-bold text-foreground">{stats.prescriptionsReceived}</p>
              </div>
              <Pill className="w-6 h-6 text-success"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.compliance')}</p>
                <p className="text-xl font-bold text-foreground">{stats.complianceScore}%</p>
                <Progress value={stats.complianceScore} className="mt-1 h-1"/>
              </div>
              <TrendingUp className="w-6 h-6 text-success"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cattle Problems & Prescriptions Summary */}
        <Card className="card-elevated lg:col-span-2 flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2"/>
                  {t('farmerDashboard.problemsAndPrescriptions')}
                </CardTitle>
                <CardDescription>{t('farmerDashboard.problemsAndPrescriptionsDesc')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => navigate('/dashboard/problems')}>
                View All <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedProblems.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                    <p>{t('farmerDashboard.noProblems')}</p>
                  </div>
                ) : (
                  reportedProblems.slice(0, 2).map((problem) => (
                    <div key={problem.id} className="border border-border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{problem.cattleTag}</span>
                        <div className="space-x-1.5">
                          <Badge className={getSeverityColor(problem.severity)}>{t(problem.severity)}</Badge>
                          <Badge className={getStatusColor(problem.status)}>{t(problem.status.replace('_', ' '))}</Badge>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">{t(problem.problem)}</p>
                      {problem.prescription && (
                        <p className="text-xs text-success mt-2 font-medium">
                          ✓ {t('Prescription Received')}: {t(problem.prescription.medication)}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Recent Treatments Summary */}
        <Card className="card-elevated flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2"/>
                  Recent Logs
                </CardTitle>
                <CardDescription>Latest treatment records</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => navigate('/dashboard/treatments')}>
                View All <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </CardHeader>
            <CardContent>
              {farmerTreatments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                  <p>{t('farmerDashboard.noTreatments')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {farmerTreatments.slice(0, 3).map((treatment) => (
                    <div key={treatment.id} className="p-3 rounded-lg border border-border bg-muted/20 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground">{treatment.animalId}</span>
                        <Badge className={`${getTreatmentStatusColor(treatment.status)} text-[10px]`}>
                          {t(treatment.status)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-medium">{t(treatment.drug)}</p>
                      <p className="text-muted-foreground mt-0.5">
                        {t('Withdrawal')}: {new Date(treatment.withdrawalDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Alerts Section Summary */}
      <Card className="card-elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2"/>
              {t('farmerDashboard.alertsAndNotifications')}
            </CardTitle>
            <CardDescription>{t('farmerDashboard.alertsAndNotificationsDesc')}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => navigate('/dashboard/alerts')}>
            View All <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                <p>{t('farmerDashboard.noActiveAlerts')}</p>
              </div>
            ) : (
              alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border text-sm ${getAlertBgColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-xs mb-0.5">{t(alert.title)}</p>
                    <p className="text-foreground text-xs truncate">{t(alert.message)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>);
};

export default FarmerDashboard;
