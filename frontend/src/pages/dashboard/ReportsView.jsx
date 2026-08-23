import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Database, ShieldAlert, Sparkles } from 'lucide-react';
import ExportReportsDialog from '@/components/forms/ExportReportsDialog';
import GenerateAnalysisDialog from '@/components/forms/GenerateAnalysisDialog';
import { useTranslation } from '@/hooks/useTranslation';

const ReportsView = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Regulatory Reports</h1>
                    <p className="text-muted-foreground">Generate, download, and export official reports on farm treatments, drug distribution, and compliance violations.</p>
                </div>
                <div className="flex space-x-2">
                    <ExportReportsDialog />
                    <GenerateAnalysisDialog />
                </div>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="w-5 h-5 mr-2 text-primary" />
                            Data Auditing
                        </CardTitle>
                        <CardDescription>Export absolute datastores matching specific parameters for external review.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            You can generate compliant records detailing active treatments, withdrawal alerts, and reported symptoms across all registered farms. Select the appropriate dialog options above to download files in Excel/CSV formats.
                        </p>
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <h4 className="text-xs font-semibold text-foreground uppercase mb-1">Standard Schema Included:</h4>
                            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                                <li>Registered Farm ID & Owner Name</li>
                                <li>Antimicrobial Drug Classification Details</li>
                                <li>Prescribed dosage & delivery routes</li>
                                <li>Calculated Withdrawal start & end dates</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-secondary" />
                            AI Insight Summaries
                        </CardTitle>
                        <CardDescription>Generate an automated summary of AMU rates and compliance benchmarks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Use the AI Generate Analysis action to compile trends on potential compliance failures, overuse of critical medications, and withdrawal period overlaps.
                        </p>
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <div className="flex items-center space-x-2 text-primary font-semibold text-sm mb-1">
                                <ShieldAlert className="w-4 h-4" />
                                <span>Regulatory Policy compliance:</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ensure that critical antimicrobials are not double-prescribed within withdrawal thresholds to remain within safe thresholds defined by national compliance databases.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReportsView;
