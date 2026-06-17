import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, FileText, AlertTriangle, TrendingUp, Pill, Eye, Stethoscope, XCircle } from 'lucide-react';
import GenerateReportDialog from '@/components/forms/GenerateReportDialog';
import PrescriptionDialog from '@/components/forms/PrescriptionDialog';
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

const VeterinarianDashboard = () => {
  const { user } = useAuth();
  const { getProblemsForVeterinarian, updateProblem } = useCattleProblems();
  const { getPendingTreatments, updateTreatment, treatments } = useTreatments();
  const { createWithdrawalAlert } = useNotifications();
  const { getNotificationsByUser } = useNotifications();
  
  const reportedProblems = getProblemsForVeterinarian();
  const pendingTreatments = getPendingTreatments();
  const vetId = user?.id || 'vet_001';
  const vetNotifications = getNotificationsByUser(vetId, 'veterinarian');
  const { t } = useTranslation();

  // Build dynamic recent activity from prescriptions and treatment decisions by this vet
  const problemActivities = reportedProblems
    .filter(p => p.prescription && p.veterinarianId === vetId)
    .map(p => ({
      id: `activity_problem_${p.id}`,
      type: 'prescription' as const,
      action: `Gave prescription for ${p.cattleTag}`,
      farm: p.farmName,
      time: p.prescription!.prescribedDate,
    }));

  const treatmentActivities = (treatments || [])
    .filter(t => t.veterinarianId === vetId && (t.status === 'approved' || t.status === 'rejected'))
    .map(t => ({
      id: `activity_treatment_${t.id}`,
      type: t.status,
      action: `${t.status === 'approved' ? 'Approved' : 'Rejected'} treatment for ${t.animalId}`,
      farm: t.farmName,
      time: (t.approvedDate || t.submittedDate),
    }));

  const combinedActivity = [...problemActivities, ...treatmentActivities]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  const isToday = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };

  // Dynamic stats for this veterinarian
  const vetReviewedTreatments = (treatments || []).filter(t => t.veterinarianId === vetId && (t.status === 'approved' || t.status === 'rejected'));
  const approvedToday = vetReviewedTreatments.filter(t => t.status === 'approved' && t.approvedDate && isToday(t.approvedDate)).length;
  const activeFarms = new Set<string>([
    ...vetReviewedTreatments.map(t => t.farmName),
    ...reportedProblems.filter(p => p.veterinarianId === vetId).map(p => p.farmName),
  ]).size;
  const approvedCount = vetReviewedTreatments.filter(t => t.status === 'approved').length;
  const totalReviewed = vetReviewedTreatments.length;
  const complianceRate = totalReviewed > 0 ? Math.round((approvedCount / totalReviewed) * 100) : 100;

  const stats = {
    pendingApprovals: pendingTreatments.length,
    approvedToday,
    activeFarms,
    complianceRate,
    pendingProblems: reportedProblems.filter(p => p.status === 'pending').length,
    prescriptionsGiven: reportedProblems.filter(p => p.status === 'prescribed' && p.veterinarianId === vetId).length,
  };

  const handleTreatmentApproval = (treatmentId: string, approved: boolean, rejectionReason?: string) => {
    updateTreatment(treatmentId, {
      status: approved ? 'approved' : 'rejected',
      veterinarianId: user?.id || 'vet_001',
      veterinarianName: user?.name || 'Dr. Unknown',
      approvedDate: approved ? new Date().toISOString() : undefined,
      rejectionReason: approved ? undefined : rejectionReason
    });
  };

  const formatTimeAgo = (iso: string) => {
    const now = Date.now();
    const ts = new Date(iso).getTime();
    const diff = Math.max(0, now - ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('timeAgo.justNow');
    if (mins < 60) return t('timeAgo.minsAgo', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('timeAgo.hoursAgo', { count: hrs });
    const days = Math.floor(hrs / 24);
    return t('timeAgo.daysAgo', { count: days });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'status-danger';
      case 'medium': return 'status-warning';
      case 'low': return 'status-info';
      default: return 'status-info';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prescribed': return 'status-success';
      case 'under_review': return 'status-warning';
      case 'pending': return 'status-info';
      case 'resolved': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handlePrescriptionGiven = (problemId: string, prescription: {
    id: string;
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
    withdrawalPeriod: number;
    prescribedDate: string;
    additionalNotes?: string;
  }) => {
    const problem = reportedProblems.find(p => p.id === problemId);
    
    updateProblem(problemId, {
      status: 'prescribed',
      prescription,
      veterinarianId: user?.id || 'vet_001'
    });
    
    // Create withdrawal alert for the farmer
    if (problem && prescription.withdrawalPeriod > 0) {
      createWithdrawalAlert(prescription, problem);
    }
  };

  const handleStartReview = (problemId: string) => {
    updateProblem(problemId, {
      status: 'under_review'
    });
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('vetDashboard.title')}</h1>
          <p className="text-muted-foreground">{t('vetDashboard.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <GenerateReportDialog />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.pendingProblems')}</p>
                <p className="text-xl font-bold text-foreground">{stats.pendingProblems}</p>
              </div>
              <Stethoscope className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.prescriptionsGiven')}</p>
                <p className="text-xl font-bold text-foreground">{stats.prescriptionsGiven}</p>
              </div>
              <Pill className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.pendingApprovals')}</p>
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
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.approvedToday')}</p>
                <p className="text-xl font-bold text-foreground">{stats.approvedToday}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.activeFarms')}</p>
                <p className="text-xl font-bold text-foreground">{stats.activeFarms}</p>
              </div>
              <Users className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated card-hover card-stagger">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('vetDashboard.compliance')}</p>
                <p className="text-xl font-bold text-foreground">{stats.complianceRate}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cattle Problems */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="w-5 h-5 mr-2" />
              {t('vetDashboard.cattleProblemsFromFarmers')}
            </CardTitle>
            <CardDescription>{t('vetDashboard.cattleProblemsFromFarmersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedProblems.map((problem) => (
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
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>{t('vetDashboard.farm')}:</strong> {problem.farmName} | <strong>{t('vetDashboard.farmer')}:</strong> {problem.farmerName}
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{problem.problem}</p>
                      <p className="text-sm text-muted-foreground mb-2">{problem.symptoms}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('vetDashboard.reported')}: {new Date(problem.reportedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {problem.prescription && (
                    <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Pill className="w-4 h-4 text-success mr-2" />
                        <span className="font-medium text-success">{t('vetDashboard.prescriptionGiven')}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-foreground">{t('vetDashboard.medication')}:</span> {problem.prescription.medication}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{t('vetDashboard.dosage')}:</span> {problem.prescription.dosage}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{t('vetDashboard.duration')}:</span> {problem.prescription.duration}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{t('vetDashboard.withdrawalPeriod')}:</span> 
                          <span className="text-red-600 dark:text-red-400 font-semibold ml-1">
                            {problem.prescription.withdrawalPeriod} {t('common.days')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {problem.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStartReview(problem.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('vetDashboard.startReview')}
                        </Button>
                        <PrescriptionDialog 
                          problem={problem} 
                          onPrescriptionGiven={handlePrescriptionGiven}
                        >
                          <Button size="sm" className="btn-gradient-primary">
                            <Pill className="w-4 h-4 mr-1" />
                            {t('vetDashboard.givePrescription')}
                          </Button>
                        </PrescriptionDialog>
                      </>
                    )}
                    {problem.status === 'under_review' && (
                      <PrescriptionDialog 
                        problem={problem} 
                        onPrescriptionGiven={handlePrescriptionGiven}
                      >
                        <Button size="sm" className="btn-gradient-primary">
                          <Pill className="w-4 h-4 mr-1" />
                          {t('vetDashboard.givePrescription')}
                        </Button>
                      </PrescriptionDialog>
                    )}
                    {problem.status === 'prescribed' && (
                      <Button size="sm" variant="outline" disabled>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t('vetDashboard.prescriptionGiven')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('vetDashboard.recentActivity')}
            </CardTitle>
            <CardDescription>{t('vetDashboard.recentActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {combinedActivity.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">{t('vetDashboard.noRecentActivity')}</div>
              ) : (
                combinedActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:shadow-sm transition-all duration-200">
                    {activity.type === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                    ) : activity.type === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-destructive mt-0.5" />
                    ) : (
                      <Pill className="w-4 h-4 text-primary mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.farm}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Approvals */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {t('vetDashboard.treatmentApprovals')}
          </CardTitle>
          <CardDescription>{t('vetDashboard.treatmentApprovalsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTreatments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('vetDashboard.noPendingTreatments')}</p>
              <p className="text-sm">{t('vetDashboard.allReviewed')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTreatments.map((treatment) => (
                <div key={treatment.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">{treatment.farmName}</span>
                        <Badge className="status-warning text-xs">
                          {t('vetDashboard.pending')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('vetDashboard.farmer')}: {treatment.farmerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('vetDashboard.submitted')}: {new Date(treatment.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-xs">
                    <div><span className="font-medium">{t('vetDashboard.animal')}:</span> {treatment.animalId} ({treatment.animalType})</div>
                    <div><span className="font-medium">{t('vetDashboard.drug')}:</span> {treatment.drug}</div>
                    <div><span className="font-medium">{t('vetDashboard.dosage')}:</span> {treatment.dosage}</div>
                    <div><span className="font-medium">{t('vetDashboard.route')}:</span> {treatment.route}</div>
                    <div><span className="font-medium">{t('vetDashboard.frequency')}:</span> {treatment.frequency}</div>
                    <div><span className="font-medium">{t('vetDashboard.duration')}:</span> {treatment.duration} {t('common.days')}</div>
                    <div><span className="font-medium">{t('vetDashboard.startDate')}:</span> {new Intl.DateTimeFormat('default', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(treatment.startDate))}</div>
                    <div><span className="font-medium">{t('vetDashboard.withdrawalDate')}:</span> {new Intl.DateTimeFormat('default', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(treatment.withdrawalDate))}</div>
                  </div>
                                    <p className="text-xs mb-4">
                      <span className="font-medium">{t('vetDashboard.reason')}:</span> {treatment.reason}
                    </p>
                  
                  {treatment.batchNumber && (
                    <p className="text-xs mb-4">
                      <span className="font-medium">{t('vetDashboard.batchNumber')}:</span> {treatment.batchNumber}
                    </p>
                  )}
<div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      className="btn-gradient-primary text-xs px-2"
                      onClick={() => handleTreatmentApproval(treatment.id, true)}
                    >
                      {t('vetDashboard.approve')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs px-2"
                    >
                      {t('vetDashboard.info')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="text-xs px-2"
                      onClick={() => handleTreatmentApproval(treatment.id, false, t('vetDashboard.treatmentRejected'))}
                    >
                      {t('vetDashboard.reject')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {t('vetDashboard.notifications')}
          </CardTitle>
          <CardDescription>{t('vetDashboard.notificationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vetNotifications.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">{t('vetDashboard.noNotifications')}</div>
            ) : (
              vetNotifications.slice(0, 5).map((n) => (
                <div key={n.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:shadow-sm transition-all duration-200">
                  <Pill className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
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

export default VeterinarianDashboard;