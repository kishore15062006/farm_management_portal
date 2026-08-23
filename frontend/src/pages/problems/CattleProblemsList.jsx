import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Stethoscope, Pill, FileText, Clock, CheckCircle, AlertTriangle, Search, Filter, Trash2 } from 'lucide-react';
import CattleProblemReportDialog from '@/components/forms/CattleProblemReportDialog';
import PrescriptionDialog from '@/components/forms/PrescriptionDialog';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

const CattleProblemsList = () => {
    const { user } = useAuth();
    const { problems, addProblem, updateProblem, deleteProblem, getProblemsByFarmer, getProblemsForVeterinarian } = useCattleProblems();
    const { createWithdrawalAlert } = useNotifications();
    const { t } = useTranslation();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteProblem = async (problemId) => {
        if (window.confirm("Are you sure you want to delete this case report?")) {
            try {
                await deleteProblem(problemId);
                toast({
                    title: "Case Deleted",
                    description: "The reported problem has been successfully deleted.",
                    variant: "sky"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete case report.",
                    variant: "destructive"
                });
            }
        }
    };

    const reportedProblems = user?.role === 'farmer' 
        ? (user ? getProblemsByFarmer(user.id) : [])
        : getProblemsForVeterinarian();

    const handleProblemReported = async (problem) => {
        try {
            await addProblem(problem);
            toast({
                title: "Problem Reported",
                description: "The veterinarian has been notified of the reported issue.",
                variant: "sky"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit cattle problem. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleStartReview = async (problemId) => {
        try {
            await updateProblem(problemId, {
                status: 'under_review'
            });
            toast({
                title: "Review Started",
                description: "The case status has been updated to Under Review.",
                variant: "sky"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update problem status.",
                variant: "destructive"
            });
        }
    };

    const handlePrescriptionGiven = async (problemId, prescription) => {
        try {
            const problem = reportedProblems.find(p => p.id === problemId);
            await updateProblem(problemId, {
                status: 'prescribed',
                prescription,
                veterinarianId: user?.id || 'vet_001'
            });
            
            // Create withdrawal alert for the farmer
            if (problem && prescription.withdrawalPeriod > 0) {
                await createWithdrawalAlert(prescription, problem);
            }

            toast({
                title: "Prescription Given",
                description: "Prescription has been logged and the farmer has been notified.",
                variant: "sky"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to issue prescription.",
                variant: "destructive"
            });
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'prescribed': return 'status-success';
            case 'under_review': return 'status-warning';
            case 'pending': return 'status-info';
            case 'resolved': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const filteredProblems = reportedProblems.filter(problem => {
        const query = searchTerm.toLowerCase();
        return (
            (problem.cattleTag && problem.cattleTag.toLowerCase().includes(query)) ||
            (problem.problem && problem.problem.toLowerCase().includes(query)) ||
            (problem.symptoms && problem.symptoms.toLowerCase().includes(query)) ||
            (problem.farmName && problem.farmName.toLowerCase().includes(query)) ||
            (problem.farmerName && problem.farmerName.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {user?.role === 'farmer' 
                            ? t('farmerDashboard.problemsAndPrescriptions') 
                            : t('vetDashboard.cattleProblemsFromFarmers')
                        }
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'farmer'
                            ? t('farmerDashboard.problemsAndPrescriptionsDesc')
                            : t('vetDashboard.cattleProblemsFromFarmersDesc')
                        }
                    </p>
                </div>
                <div className="flex space-x-2">
                    {user?.role === 'farmer' && (
                        <CattleProblemReportDialog onProblemReported={handleProblemReported}/>
                    )}
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2"/>
                        {t('treatmentsList.filter')}
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card className="card-elevated">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                        <Input 
                            placeholder={t('searchPlaceholder')}
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Problems List */}
            <Card className="card-elevated">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2"/>
                        {user?.role === 'farmer' 
                            ? t('farmerDashboard.problemsAndPrescriptions')
                            : "Reported Cattle Cases"
                        }
                    </CardTitle>
                    <CardDescription>
                        {user?.role === 'farmer' 
                            ? "Complete log of your reported cattle issues and prescriptions."
                            : "Cases reported by farmers requiring veterinary clinical attention."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredProblems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30 text-primary" />
                            <p className="text-lg font-semibold">{t('farmerDashboard.noProblems')}</p>
                            <p className="text-sm">
                                {user?.role === 'farmer' 
                                    ? t('farmerDashboard.noProblemsCta')
                                    : "No active clinical problem reports found from registered farms."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredProblems.map((problem) => (
                                <div key={problem.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-card">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-semibold text-foreground text-base">{problem.cattleTag}</span>
                                                <Badge className={getSeverityColor(problem.severity)}>
                                                    {t(problem.severity)}
                                                </Badge>
                                                <Badge className={getStatusColor(problem.status)}>
                                                    {t(problem.status.replace('_', ' '))}
                                                </Badge>
                                            </div>
                                            {user?.role === 'veterinarian' && (
                                                <div className="text-sm text-muted-foreground mb-2">
                                                    <strong>{t('vetDashboard.farm')}:</strong> {t(problem.farmName)} | <strong>{t('vetDashboard.farmer')}:</strong> {t(problem.farmerName)}
                                                </div>
                                            )}
                                            <p className="text-sm font-medium text-foreground mb-1">{t(problem.problem)}</p>
                                            <p className="text-sm text-muted-foreground mb-2">{t(problem.symptoms)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t('farmerDashboard.reported')}: {new Date(problem.reportedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteProblem(problem.id)}
                                            className="text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {problem.prescription && (
                                        <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                                            <div className="flex items-center mb-3">
                                                <Pill className="w-4 h-4 text-success mr-2"/>
                                                <span className="font-semibold text-success">
                                                    {user?.role === 'farmer' ? t('farmerDashboard.prescriptionReceived') : t('vetDashboard.prescriptionGiven')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                                                <div>
                                                    <span className="font-medium text-muted-foreground">{t('farmerDashboard.medication')}:</span> 
                                                    <span className="text-foreground ml-1 font-semibold">{t(problem.prescription.medication)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">{t('farmerDashboard.dosage')}:</span> 
                                                    <span className="text-foreground ml-1">{t(problem.prescription.dosage)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">{t('farmerDashboard.duration')}:</span> 
                                                    <span className="text-foreground ml-1">{t(problem.prescription.duration)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-muted-foreground">{t('farmerDashboard.withdrawalPeriod')}:</span> 
                                                    <span className="text-destructive font-semibold ml-1">
                                                        {problem.prescription.withdrawalPeriod} {t('common.days')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm mb-2">
                                                <span className="font-medium text-muted-foreground">{t('farmerDashboard.instructions')}:</span>
                                                <p className="text-foreground mt-1">{t(problem.prescription.instructions)}</p>
                                            </div>
                                            <div className="text-xs text-success flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1"/>
                                                {t('farmerDashboard.safeAfter')}: {new Date(new Date(problem.prescription.prescribedDate).getTime() +
                                                    problem.prescription.withdrawalPeriod * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}

                                    {problem.status === 'pending' && user?.role === 'farmer' && (
                                        <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning flex items-center">
                                            <Clock className="w-4 h-4 mr-2"/>
                                            {t('farmerDashboard.waitingForReview')}
                                        </div>
                                    )}

                                    {user?.role === 'veterinarian' && (
                                        <div className="flex space-x-2 mt-4 pt-3 border-t border-border">
                                            {problem.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => handleStartReview(problem.id)}>
                                                        <Eye className="w-4 h-4 mr-1.5"/>
                                                        {t('vetDashboard.startReview')}
                                                    </Button>
                                                    <PrescriptionDialog problem={problem} onPrescriptionGiven={handlePrescriptionGiven}>
                                                        <Button size="sm" className="btn-gradient-primary">
                                                            <Pill className="w-4 h-4 mr-1.5"/>
                                                            {t('vetDashboard.givePrescription')}
                                                        </Button>
                                                    </PrescriptionDialog>
                                                </>
                                            )}
                                            {problem.status === 'under_review' && (
                                                <PrescriptionDialog problem={problem} onPrescriptionGiven={handlePrescriptionGiven}>
                                                    <Button size="sm" className="btn-gradient-primary">
                                                        <Pill className="w-4 h-4 mr-1.5"/>
                                                        {t('vetDashboard.givePrescription')}
                                                    </Button>
                                                </PrescriptionDialog>
                                            )}
                                            {problem.status === 'prescribed' && (
                                                <Button size="sm" variant="outline" disabled className="text-success border-success/20 bg-success/5">
                                                    <CheckCircle className="w-4 h-4 mr-1.5 text-success"/>
                                                    {t('vetDashboard.prescriptionGiven')}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CattleProblemsList;
