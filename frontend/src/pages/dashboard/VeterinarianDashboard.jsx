import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users, FileText, TrendingUp, Pill, Eye, Stethoscope, XCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenerateReportDialog from '@/components/forms/GenerateReportDialog';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from '@/hooks/useTranslation';

const VeterinarianDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getProblemsForVeterinarian } = useCattleProblems();
    const { getPendingTreatments, treatments } = useTreatments();
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
            type: 'prescription',
            action: `Gave prescription for ${p.cattleTag}`,
            farm: p.farmName,
            time: p.prescription.prescribedDate,
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
        .slice(0, 5); // Limit dashboard to 5 items

    const isToday = (iso) => {
        const d = new Date(iso);
        const now = new Date();
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    };

    const vetReviewedTreatments = (treatments || []).filter(t => t.veterinarianId === vetId && (t.status === 'approved' || t.status === 'rejected'));
    const approvedToday = vetReviewedTreatments.filter(t => t.status === 'approved' && t.approvedDate && isToday(t.approvedDate)).length;
    const activeFarms = new Set([
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

    const formatTimeAgo = (iso) => {
        const now = Date.now();
        const ts = new Date(iso).getTime();
        const diff = Math.max(0, now - ts);
        const mins = Math.floor(diff / 60000);
        if (mins < 1)
            return t('timeAgo.justNow');
        if (mins < 60)
            return t('timeAgo.minsAgo', { count: mins });
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)
            return t('timeAgo.hoursAgo', { count: hrs });
        const days = Math.floor(hrs / 24);
        return t('timeAgo.daysAgo', { count: days });
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'prescribed': return 'status-success';
            case 'under_review': return 'status-warning';
            case 'pending': return 'status-info';
            case 'resolved': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (<div className="space-y-6 animation-fade-in">
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
              <Stethoscope className="w-6 h-6 text-blue-500"/>
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
              <Pill className="w-6 h-6 text-green-500"/>
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
              <Clock className="w-6 h-6 text-warning"/>
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
              <CheckCircle className="w-6 h-6 text-success"/>
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
              <Users className="w-6 h-6 text-primary"/>
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
              <TrendingUp className="w-6 h-6 text-secondary"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cattle Problems Summary */}
        <Card className="card-elevated lg:col-span-2 flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2"/>
                  {t('vetDashboard.cattleProblemsFromFarmers')}
                </CardTitle>
                <CardDescription>{t('vetDashboard.cattleProblemsFromFarmersDesc')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => navigate('/dashboard/problems')}>
                Review Cases <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedProblems.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                    <p>No reported problems pending review.</p>
                  </div>
                ) : (
                  reportedProblems.slice(0, 2).map((problem) => (
                    <div key={problem.id} className="border border-border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">{problem.cattleTag}</span>
                          <Badge className={getSeverityColor(problem.severity)}>{t(problem.severity)}</Badge>
                          <Badge className={getStatusColor(problem.status)}>{t(problem.status.replace('_', ' '))}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{t(problem.farmName)}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{t(problem.problem)}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{t(problem.symptoms)}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="card-elevated flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2"/>
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
                    <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg border border-border bg-muted/10 text-xs">
                      {activity.type === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-success mt-0.5"/>
                      ) : activity.type === 'rejected' ? (
                        <XCircle className="w-4 h-4 text-destructive mt-0.5"/>
                      ) : (
                        <Pill className="w-4 h-4 text-primary mt-0.5"/>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium truncate">{activity.action}</p>
                        <p className="text-muted-foreground text-[10px] truncate">{activity.farm}</p>
                        <p className="text-muted-foreground text-[10px] mt-0.5">{formatTimeAgo(activity.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>);
};

export default VeterinarianDashboard;
