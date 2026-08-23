import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Calendar, AlertTriangle } from 'lucide-react';
import { useCattleProblems } from '@/contexts/CattleProblemContext';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useTranslation } from '@/hooks/useTranslation';

const FarmersList = () => {
    const { problems } = useCattleProblems();
    const { treatments } = useTreatments();
    const { t } = useTranslation();

    // Dynamically compile the list of farmers and calculate their statistics from the database
    const farmersMap = {};

    treatments.forEach(t => {
        if (t.farmerId) {
            if (!farmersMap[t.farmerId]) {
                farmersMap[t.farmerId] = {
                    id: t.farmerId,
                    name: t.farmerName || 'Unknown Farmer',
                    farmName: t.farmName || 'Unknown Farm',
                    problemsCount: 0,
                    treatmentsCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                };
            }
            farmersMap[t.farmerId].treatmentsCount += 1;
            if (t.status === 'approved') {
                farmersMap[t.farmerId].approvedCount += 1;
            } else if (t.status === 'rejected') {
                farmersMap[t.farmerId].rejectedCount += 1;
            }
        }
    });

    problems.forEach(p => {
        if (p.farmerId) {
            if (!farmersMap[p.farmerId]) {
                farmersMap[p.farmerId] = {
                    id: p.farmerId,
                    name: p.farmerName || 'Unknown Farmer',
                    farmName: p.farmName || 'Unknown Farm',
                    problemsCount: 0,
                    treatmentsCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                };
            }
            farmersMap[p.farmerId].problemsCount += 1;
        }
    });

    const farmersList = Object.values(farmersMap);

    const calculateCompliance = (farmer) => {
        const totalReviewed = farmer.approvedCount + farmer.rejectedCount;
        if (totalReviewed === 0) return 100;
        return Math.round((farmer.approvedCount / totalReviewed) * 100);
    };

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('vetDashboard.activeFarms')}</h1>
                <p className="text-muted-foreground">List of active registered farms, their contact details, and their dynamic veterinary compliance status.</p>
            </div>

            {/* Farmers List Grid */}
            <Card className="card-elevated">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        Registered Farms ({farmersList.length})
                    </CardTitle>
                    <CardDescription>Directory of farmers currently submitting veterinary problems and treatment logs.</CardDescription>
                </CardHeader>
                <CardContent>
                    {farmersList.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-30 text-primary" />
                            <p className="text-lg font-semibold">No Registered Farms Found</p>
                            <p className="text-sm">Once farmers report problems or log treatments, they will appear in this directory.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {farmersList.map((farmer) => {
                                const compliance = calculateCompliance(farmer);
                                return (
                                    <div key={farmer.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-card">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                {farmer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{farmer.name}</h3>
                                                <p className="text-xs text-muted-foreground">{farmer.farmName}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 border-y border-border py-4 mb-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="w-4 h-4 text-warning" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Problems</p>
                                                    <p className="font-semibold text-foreground">{farmer.problemsCount}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-success" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Treatments</p>
                                                    <p className="font-semibold text-foreground">{farmer.treatmentsCount}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Shield className="w-3.5 h-3.5 mr-1 text-primary" />
                                                Compliance Rate
                                            </span>
                                            <Badge className={compliance >= 80 ? 'status-success' : compliance >= 50 ? 'status-warning' : 'status-danger'}>
                                                {compliance}%
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmersList;
