import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Package, AlertTriangle, TrendingUp, Plus, Clock, FileText, Pill, CheckCircle, XCircle } from 'lucide-react';
import NewTreatmentDialog from '@/components/forms/NewTreatmentDialog';
import AddFeedAdditiveDialog from '@/components/forms/AddFeedAdditiveDialog';
import CattleProblemReportDialog from '@/components/forms/CattleProblemReportDialog';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

interface CattleProblem {
  id: string;
  cattleId: string;
  cattleTag: string;
  problem: string;
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  status: 'pending' | 'under_review' | 'prescribed' | 'resolved';
  farmerId: string;
  farmerName: string;
  farmName: string;
  veterinarianId?: string;
  prescription?: {
    id: string;
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
    withdrawalPeriod: number;
    prescribedDate: string;
  };
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { getProblemsByFarmer, addProblem } = useCattleProblems();
  const { getTreatmentsByFarmer, getApprovedTreatments } = useTreatments();
  const { getActiveWithdrawalAlerts, getNotificationsByUser } = useNotifications();
  const { t } = useTranslation();
  
  const reportedProblems = user ? getProblemsByFarmer(user.id) : [];
  const farmerTreatments = user ? getTreatmentsByFarmer(user.id) : [];
  const approvedTreatments = user ? getApprovedTreatments(user.id) : [];
  const withdrawalAlerts = user ? getActiveWithdrawalAlerts(user.id) : [];
  const allNotifications = user ? getNotificationsByUser(user.id, 'farmer') : [];

  // Mock data
  const stats = {
    activeTreatments: approvedTreatments.length,
    pendingApprovals: farmerTreatments.filter(t => t.status === 'pending').length,
    feedAdditivesUsed: 5,
    complianceScore: 85,
    reportedProblems: reportedProblems.length,
    prescriptionsReceived: reportedProblems.filter(p => p.status === 'prescribed').length
  };

  const getTreatmentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'status-success';
      case 'pending': return 'status-warning';
      case 'rejected': return 'status-danger';
      default: return 'status-info';
    }
  };

  // Generate dynamic alerts from notifications
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
    // Add other types of alerts
    ...allNotifications
      .filter(n => n.type !== 'withdrawal_alert' && !n.read)
      .slice(0, 3)
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info': return <Clock className="w-4 h-4 text-info" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };
  
  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-destructive/10 border-destructive/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-info/10 border-info/20';
      default: return 'bg-muted/50 border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prescribed': return 'status-success';
      case 'under_review': return 'status-warning';
      case 'pending': return 'status-info';
      case 'resolved': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'status-danger';
      case 'high': return 'status-warning';
      case 'medium': return 'status-info';
      case 'low': return 'status-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleProblemReported = (problem: CattleProblem) => {
    addProblem(problem);
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('farmerDashboard.title')}</h1>
          <p className="text-muted-foreground">{t('farmerDashboard.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CattleProblemReportDialog onProblemReported={handleProblemReported} />
          <NewTreatmentDialog />
          <AddFeedAdditiveDialog />
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
              <Calendar className="w-6 h-6 text-primary" />
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
              <Clock className="w-6 h-6 text-warning" />
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
              <Package className="w-6 h-6 text-secondary" />
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
              <FileText className="w-6 h-6 text-info" />
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
              <Pill className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('farmerDashboard.compliance')}</p>
                <p className="text-xl font-bold text-foreground">{stats.complianceScore}%</p>
                <Progress value={stats.complianceScore} className="mt-1 h-1" />
              </div>
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cattle Problems & Prescriptions */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('farmerDashboard.problemsAndPrescriptions')}
            </CardTitle>
            <CardDescription>{t('farmerDashboard.problemsAndPrescriptionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedProblems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('farmerDashboard.noProblems')}</p>
                  <p className="text-sm">{t('farmerDashboard.noProblemsCta')}</p>
                </div>
              ) : (
                reportedProblems.map((problem) => (
                  <div key={problem.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-foreground">{problem.cattleTag}</span>
                          <Badge className={getSeverityColor(problem.severity)}>
                            {problem.severity}
                          </Badge>
                          <Badge className={getStatusColor(problem.status)}>
                            {problem.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{problem.problem}</p>
                        <p className="text-sm text-muted-foreground mb-2">{problem.symptoms}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('farmerDashboard.reported')}: {new Date(problem.reportedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {problem.prescription && (
                      <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Pill className="w-4 h-4 text-success mr-2" />
                          <span className="font-medium text-success">{t('farmerDashboard.prescriptionReceived')}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-foreground">{t('farmerDashboard.medication')}:</span> 
                            <span className="text-foreground ml-1">{problem.prescription.medication}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{t('farmerDashboard.dosage')}:</span> 
                            <span className="text-foreground ml-1">{problem.prescription.dosage}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{t('farmerDashboard.duration')}:</span> 
                            <span className="text-foreground ml-1">{problem.prescription.duration}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{t('farmerDashboard.withdrawalPeriod')}:</span> 
                            <span className="text-destructive font-semibold ml-1">
                              {problem.prescription.withdrawalPeriod} {t('common.days')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm text-foreground">{t('farmerDashboard.instructions')}:</span>
                          <p className="text-sm text-foreground mt-1">{problem.prescription.instructions}</p>
                        </div>
                        <div className="mt-2 text-xs text-success">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {t('farmerDashboard.safeAfter')}: {
                            new Date(
                              new Date(problem.prescription.prescribedDate).getTime() +
                              problem.prescription.withdrawalPeriod * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()
                          }
                        </div>
                      </div>
                    )}

                    {problem.status === 'pending' && (
                      <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {t('farmerDashboard.waitingForReview')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Treatments */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {t('farmerDashboard.recentTreatments')}
            </CardTitle>
            <CardDescription>{t('farmerDashboard.recentTreatmentsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {farmerTreatments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('farmerDashboard.noTreatments')}</p>
                <p className="text-sm">{t('farmerDashboard.noTreatmentsCta')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {farmerTreatments.slice(0, 5).map((treatment) => (
                  <div key={treatment.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:shadow-sm transition-all duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground text-sm">{treatment.animalId}</span>
                        <Badge className={`${getTreatmentStatusColor(treatment.status)} text-xs`}>
                          {treatment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{treatment.drug}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('farmerDashboard.withdrawal')}: {new Date(treatment.withdrawalDate).toLocaleDateString()}
                      </p>
                      {treatment.veterinarianName && treatment.status === 'approved' && (
                        <p className="text-xs text-success">
                          {t('farmerDashboard.approvedBy')}: {treatment.veterinarianName}
                        </p>
                      )}
                      {treatment.rejectionReason && treatment.status === 'rejected' && (
                        <p className="text-xs text-destructive">
                          {t('farmerDashboard.rejected')}: {treatment.rejectionReason}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t('farmerDashboard.alertsAndNotifications')}
          </CardTitle>
          <CardDescription>{t('farmerDashboard.alertsAndNotificationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('farmerDashboard.noActiveAlerts')}</p>
                <p className="text-sm">{t('farmerDashboard.noActiveAlertsDesc')}</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getAlertBgColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    {alert.title && (
                      <h4 className="text-sm font-semibold text-foreground mb-1">{alert.title}</h4>
                    )}
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{alert.date}</p>
                      {alert.cattleTag && alert.medication && (
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">{alert.cattleTag}</Badge>
                          <Badge variant="outline" className="text-xs">{alert.medication}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
