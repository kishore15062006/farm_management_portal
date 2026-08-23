import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Package } from 'lucide-react';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useFeedAdditives } from '@/contexts/FeedAdditiveContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

const ApprovalsList = () => {
    const { getPendingTreatments, updateTreatment } = useTreatments();
    const { getPendingFeedAdditives, updateFeedAdditive } = useFeedAdditives();
    const { user } = useAuth();
    const { t } = useTranslation();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('treatments'); // 'treatments' or 'additives'

    const pendingTreatments = getPendingTreatments();
    const pendingAdditives = getPendingFeedAdditives ? getPendingFeedAdditives() : [];

    const handleTreatmentApproval = async (treatmentId, approved, rejectionReason) => {
        try {
            await updateTreatment(treatmentId, {
                status: approved ? 'approved' : 'rejected',
                veterinarianId: user?.id || 'vet_001',
                veterinarianName: user?.name || 'Dr. Sarah Wilson',
                approvedDate: approved ? new Date().toISOString() : undefined,
                rejectionReason: approved ? undefined : rejectionReason
            });
            toast({
                title: approved ? t("Treatment Approved") : t("Treatment Rejected"),
                description: approved ? t("The treatment has been approved and the farmer is notified.") : t("The treatment has been rejected."),
                variant: approved ? "sky" : "destructive"
            });
        } catch (error) {
            toast({
                title: t("Action Failed"),
                description: t("Failed to process the treatment approval. Please try again."),
                variant: "destructive"
            });
        }
    };

    const handleAdditiveApproval = async (additiveId, approved) => {
        try {
            await updateFeedAdditive(additiveId, {
                status: approved ? 'active' : 'rejected'
            });
            toast({
                title: approved ? t("Feed Additive Approved") : t("Feed Additive Rejected"),
                description: approved ? t("The feed additive request has been approved.") : t("The feed additive request has been rejected."),
                variant: approved ? "sky" : "destructive"
            });
        } catch (error) {
            toast({
                title: t("Action Failed"),
                description: t("Failed to process the feed additive approval."),
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('vetDashboard.treatmentApprovals')}</h1>
                <p className="text-muted-foreground">{t('vetDashboard.treatmentApprovalsDesc')}</p>
            </div>

            {/* Tabs Selector */}
            <div className="flex space-x-2 border-b border-border pb-px mb-6">
                <Button 
                    variant={activeTab === 'treatments' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('treatments')}
                    className={`rounded-b-none border-b-2 text-sm font-medium px-4 py-2 ${
                        activeTab === 'treatments' ? 'border-primary' : 'border-transparent'
                    }`}
                >
                    {t('Medication Treatments')} ({pendingTreatments.length})
                </Button>
                <Button 
                    variant={activeTab === 'additives' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('additives')}
                    className={`rounded-b-none border-b-2 text-sm font-medium px-4 py-2 ${
                        activeTab === 'additives' ? 'border-primary' : 'border-transparent'
                    }`}
                >
                    {t('Feed Additives')} ({pendingAdditives.length})
                </Button>
            </div>

            {/* Content Tab */}
            {activeTab === 'treatments' ? (
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-warning" />
                            {t('Pending Medication Requests')} ({pendingTreatments.length})
                        </CardTitle>
                        <CardDescription>{t('Review and approve drug application requests from registered farmers.')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingTreatments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Clock className="w-16 h-16 mx-auto mb-4 opacity-30 text-warning" />
                                <p className="text-lg font-semibold">{t('vetDashboard.noPendingTreatments')}</p>
                                <p className="text-sm">{t('vetDashboard.allReviewed')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingTreatments.map((treatment) => (
                                    <div key={treatment.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-card">
                                        <div className="flex items-start justify-between mb-3 border-b border-border pb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-semibold text-foreground text-sm">{t(treatment.farmName)}</span>
                                                    <Badge className="status-warning text-[10px]">
                                                        {t('vetDashboard.pending')}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{t('vetDashboard.farmer')}: {t(treatment.farmerName)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('vetDashboard.submitted')}: {new Date(treatment.submittedDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4 text-xs">
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.animal')}:</span> <span className="text-foreground font-medium">{treatment.animalId} ({t(treatment.animalType)})</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.drug')}:</span> <span className="text-foreground font-medium">{t(treatment.drug)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.dosage')}:</span> <span className="text-foreground font-medium">{t(treatment.dosage)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.route')}:</span> <span className="text-foreground font-medium">{t(treatment.route)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.frequency')}:</span> <span className="text-foreground font-medium">{t(treatment.frequency)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.duration')}:</span> <span className="text-foreground font-medium">{treatment.duration} {t('common.days')}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.startDate')}:</span> <span className="text-foreground font-medium">{new Date(treatment.startDate).toLocaleDateString()}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('vetDashboard.withdrawalDate')}:</span> <span className="text-foreground font-medium">{new Date(treatment.withdrawalDate).toLocaleDateString()}</span></div>
                                        </div>
                                        
                                        <p className="text-xs mb-4 p-2 bg-muted/50 rounded border border-border">
                                            <span className="font-medium text-muted-foreground">{t('vetDashboard.reason')}:</span> <span className="text-foreground">{t(treatment.reason)}</span>
                                        </p>
                                        
                                        {treatment.batchNumber && (
                                            <p className="text-xs mb-4">
                                                <span className="font-medium text-muted-foreground">{t('vetDashboard.batchNumber')}:</span> <span className="text-foreground font-mono">{treatment.batchNumber}</span>
                                            </p>
                                        )}
                                        
                                        <div className="flex space-x-2 pt-2 border-t border-border mt-3">
                                            <Button size="sm" className="btn-gradient-primary text-xs flex-1" onClick={() => handleTreatmentApproval(treatment.id, true)}>
                                                {t('vetDashboard.approve')}
                                            </Button>
                                            <Button size="sm" variant="destructive" className="text-xs flex-1" onClick={() => handleTreatmentApproval(treatment.id, false, "Treatment Rejected by Vet")}>
                                                {t('vetDashboard.reject')}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-warning" />
                            {t('Pending Feed Additive Requests')} ({pendingAdditives.length})
                        </CardTitle>
                        <CardDescription>{t('Review and approve medicated feed additive requests submitted by farmers.')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingAdditives.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Package className="w-16 h-16 mx-auto mb-4 opacity-30 text-warning" />
                                <p className="text-lg font-semibold">{t('No pending feed additives')}</p>
                                <p className="text-sm">{t('All logged feed additive requests have been reviewed.')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingAdditives.map((additive) => (
                                    <div key={additive.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-card">
                                        <div className="flex items-start justify-between mb-3 border-b border-border pb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-semibold text-foreground text-sm">{t(additive.farmName)}</span>
                                                    <Badge className="status-warning text-[10px]">
                                                        {t('Pending Approval')}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{t('Farmer')}: {t(additive.farmerName)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('Log Period')}: {additive.startDate} {t('to')} {additive.endDate}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4 text-xs">
                                            <div><span className="font-medium text-muted-foreground">{t('Feed Type')}:</span> <span className="text-foreground font-medium">{t(additive.feedType)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Medication/Drug')}:</span> <span className="text-foreground font-medium">{t(additive.drug)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Batch Number')}:</span> <span className="text-foreground font-mono">{additive.batchNumber}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Quantity')}:</span> <span className="text-foreground font-medium">{additive.quantity} {t(additive.unit)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Concentration')}:</span> <span className="text-foreground font-medium">{t(additive.concentration)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Supplier')}:</span> <span className="text-foreground font-medium">{t(additive.supplier)}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Withdrawal Starts')}:</span> <span className="text-foreground font-medium">{additive.withdrawalDate}</span></div>
                                            <div><span className="font-medium text-muted-foreground">{t('Animal Group')}:</span> <span className="text-foreground font-medium">{t(additive.animalGroup)} ({t('count')}: {additive.totalAnimals})</span></div>
                                        </div>
                                        
                                        {additive.notes && (
                                            <p className="text-xs mb-4 p-2 bg-muted/50 rounded border border-border">
                                                <span className="font-medium text-muted-foreground">{t('Notes')}:</span> <span className="text-foreground">{t(additive.notes)}</span>
                                            </p>
                                        )}
                                        
                                        <div className="flex space-x-2 pt-2 border-t border-border mt-3">
                                            <Button size="sm" className="btn-gradient-primary text-xs flex-1" onClick={() => handleAdditiveApproval(additive.id, true)}>
                                                {t('vetDashboard.approve')}
                                            </Button>
                                            <Button size="sm" variant="destructive" className="text-xs flex-1" onClick={() => handleAdditiveApproval(additive.id, false)}>
                                                {t('vetDashboard.reject')}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ApprovalsList;
