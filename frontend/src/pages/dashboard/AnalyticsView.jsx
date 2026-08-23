import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert } from 'lucide-react';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useTranslation } from '@/hooks/useTranslation';

const AnalyticsView = () => {
    const { treatments } = useTreatments();
    const { t } = useTranslation();

    // 1. Calculate Monthly Usage Trends dynamically from the database
    const getMonthlyStats = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const stats = {};
        
        // Initialize details for the last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            stats[mKey] = {
                month: monthNames[d.getMonth()],
                usage: 0,
                farms: new Set()
            };
        }
        
        // Aggregate from database treatments
        treatments.forEach(t => {
            if (!t.startDate) return;
            const tDate = new Date(t.startDate);
            const mKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
            if (stats[mKey]) {
                stats[mKey].usage += 1;
                if (t.farmName) {
                    stats[mKey].farms.add(t.farmName);
                }
            }
        });

        return Object.keys(stats).sort().map(key => ({
            month: stats[key].month,
            usage: stats[key].usage || 0,
            farms: stats[key].farms.size || 0
        }));
    };

    // 2. Calculate Drug Distribution percentage dynamically from the database
    const getDrugDistribution = () => {
        const drugsCount = {};
        treatments.forEach(t => {
            if (t.drug) {
                const drugName = t.drug.trim();
                drugsCount[drugName] = (drugsCount[drugName] || 0) + 1;
            }
        });
        
        const total = Object.values(drugsCount).reduce((a, b) => a + b, 0);
        if (total === 0) {
            return [
                { name: 'No Treatments Recorded', value: 100, color: 'hsl(var(--muted))' }
            ];
        }
        
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
        return Object.keys(drugsCount).map((name, index) => ({
            name,
            value: Math.round((drugsCount[name] / total) * 100),
            color: colors[index % colors.length]
        }));
    };

    const monthlyUsage = getMonthlyStats();
    const drugUsage = getDrugDistribution();

    return (
        <div className="space-y-6 animation-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t('regDashboard.title')} - Analytics</h1>
                <p className="text-muted-foreground">Interactive graphs showing antimicrobial usage (AMU) tracking, drug distribution, and growth curves.</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Usage Trend */}
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                            {t('regDashboard.monthlyTrends')}
                        </CardTitle>
                        <CardDescription>{t('regDashboard.monthlyTrendsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyUsage}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                <XAxis dataKey="month" stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                                <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}/>
                                <Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Drug Distribution */}
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-secondary" />
                            {t('regDashboard.drugDistribution')}
                        </CardTitle>
                        <CardDescription>{t('regDashboard.drugDistributionDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={drugUsage} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                                    {drugUsage.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Farm Growth Chart */}
                <Card className="card-elevated lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-success" />
                            {t('regDashboard.farmGrowth')}
                        </CardTitle>
                        <CardDescription>{t('regDashboard.farmGrowthDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyUsage}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                <XAxis dataKey="month" stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                                <YAxis stroke="hsl(var(--border))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}/>
                                <Bar dataKey="farms" fill="hsl(var(--secondary))"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsView;
