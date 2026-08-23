import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, Pill, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

// AMU withdrawal period database
const AMU_WITHDRAWAL_DB = {
    'Amoxicillin': { days: 7, category: 'Penicillin' },
    'Oxytetracycline': { days: 14, category: 'Tetracycline' },
    'Penicillin G': { days: 7, category: 'Penicillin' },
    'Ceftiofur': { days: 4, category: 'Cephalosporin' },
    'Florfenicol': { days: 28, category: 'Chloramphenicol' },
    'Enrofloxacin': { days: 10, category: 'Fluoroquinolone' },
    'Sulfadimethoxine': { days: 5, category: 'Sulfonamide' },
    'Tilmicosin': { days: 28, category: 'Macrolide' },
    'Tulathromycin': { days: 49, category: 'Macrolide' },
    'Ceftriaxone': { days: 4, category: 'Cephalosporin' },
    'Gentamicin': { days: 2, category: 'Aminoglycoside' },
    'Neomycin': { days: 2, category: 'Aminoglycoside' },
    'Spectinomycin': { days: 2, category: 'Aminoglycoside' },
    'Trimethoprim-Sulfa': { days: 5, category: 'Sulfonamide' },
    'Doxycycline': { days: 14, category: 'Tetracycline' },
    'Chlortetracycline': { days: 14, category: 'Tetracycline' },
    'Tetracycline': { days: 14, category: 'Tetracycline' },
    'Erythromycin': { days: 7, category: 'Macrolide' },
    'Tylosin': { days: 7, category: 'Macrolide' },
    'Lincomycin': { days: 7, category: 'Lincosamide' }
};

const PrescriptionDialog = ({ problem, onPrescriptionGiven, children }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        medication: '',
        dosage: '',
        duration: '',
        instructions: '',
        additionalNotes: ''
    });
    const [calculatedWithdrawal, setCalculatedWithdrawal] = useState(null);

    const parseDurationDays = (durationStr) => {
        if (!durationStr) return 0;
        const match = durationStr.match(/(\d+)/);
        if (!match) return 0;
        const val = parseInt(match[1], 10);
        if (durationStr.toLowerCase().includes('week')) {
            return val * 7;
        }
        if (durationStr.toLowerCase().includes('month')) {
            return val * 30;
        }
        return val;
    };

    const calculateWithdrawalPeriod = (medication, durationStr) => {
        const amuData = AMU_WITHDRAWAL_DB[medication];
        if (amuData) {
            const durationDays = parseDurationDays(durationStr);
            const totalDays = amuData.days + durationDays;
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + totalDays);
            setCalculatedWithdrawal({
                days: totalDays,
                category: amuData.category,
                endDate: endDate.toISOString().split('T')[0]
            });
        }
        else {
            setCalculatedWithdrawal(null);
        }
    };

    const handleMedicationChange = (medication) => {
        setFormData(prev => ({ ...prev, medication }));
        calculateWithdrawalPeriod(medication, formData.duration);
    };

    const handleDurationChange = (e) => {
        const duration = e.target.value;
        setFormData(prev => ({ ...prev, duration }));
        if (formData.medication) {
            calculateWithdrawalPeriod(formData.medication, duration);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const prescription = {
                id: `prescription_${Date.now()}`,
                medication: formData.medication,
                dosage: formData.dosage,
                duration: formData.duration,
                instructions: formData.instructions,
                withdrawalPeriod: calculatedWithdrawal?.days || 0,
                prescribedDate: new Date().toISOString(),
                additionalNotes: formData.additionalNotes
            };
            onPrescriptionGiven(problem.id, prescription);
            toast({
                title: t("Prescription Created Successfully"),
                description: `${t('Prescription for')} ${problem.cattleTag} ${t('has been created with')} ${calculatedWithdrawal?.days || 0} ${t('days withdrawal period.')}`,
                variant: "sky"
            });
            setFormData({
                medication: '',
                dosage: '',
                duration: '',
                instructions: '',
                additionalNotes: ''
            });
            setCalculatedWithdrawal(null);
            setOpen(false);
        }
        catch (error) {
            toast({
                title: t("Error"),
                description: t("Failed to create prescription. Please try again."),
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
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

    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Pill className="w-5 h-5 mr-2 text-primary"/>
            {t('Create Prescription')}
          </DialogTitle>
          <DialogDescription>
            {t('Provide prescription for')} {problem.cattleTag} - {t(problem.problem)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Problem Summary */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{t('Problem Summary')}</span>
                <Badge className={getSeverityColor(problem.severity)}>
                  {t(problem.severity.toUpperCase())}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div><strong>{t('Farm')}:</strong> {t(problem.farmName)}</div>
                <div><strong>{t('Farmer')}:</strong> {t(problem.farmerName)}</div>
                <div><strong>{t('Problem')}:</strong> {t(problem.problem)}</div>
                <div><strong>{t('Symptoms')}:</strong> {t(problem.symptoms)}</div>
                <div><strong>{t('Reported')}:</strong> {new Date(problem.reportedDate).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">{t('Medication')} *</Label>
                <Select value={formData.medication} onValueChange={handleMedicationChange}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder={t('Select medication')}/>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(AMU_WITHDRAWAL_DB).map((med) => (<SelectItem key={med} value={med}>
                        <div className="flex items-center justify-between w-full">
                          <span>{t(med)}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {t(AMU_WITHDRAWAL_DB[med].category)}
                          </Badge>
                        </div>
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">{t('Dosage')} *</Label>
                <Input id="dosage" placeholder={t('e.g., 500mg, 2ml/kg')} value={formData.dosage} onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">{t('Duration')} *</Label>
                <Input id="duration" placeholder={t('e.g., 7 days, 2 weeks')} value={formData.duration} onChange={handleDurationChange} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"/>
              </div>

              <div className="space-y-2">
                <Label>{t('Withdrawal Period')}</Label>
                <div className="p-3 bg-info/10 border border-info/20 rounded-md">
                  {calculatedWithdrawal ? (<div className="text-sm">
                      <div className="font-medium text-info">
                        {calculatedWithdrawal.days} {t('days')}
                      </div>
                      <div className="text-info/80">
                        {t('Category')}: {t(calculatedWithdrawal.category)}
                      </div>
                      <div className="text-info/80">
                        {t('Safe for consumption')}: {calculatedWithdrawal.endDate}
                      </div>
                    </div>) : (<div className="text-sm text-muted-foreground">
                      {t('Select medication to calculate withdrawal period')}
                    </div>)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">{t('Administration Instructions')} *</Label>
              <Textarea id="instructions" placeholder={t('Detailed instructions for administering the medication...')} value={formData.instructions} onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))} required rows={4} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">{t('Additional Notes')}</Label>
              <Textarea id="additionalNotes" placeholder={t('Any additional recommendations or follow-up instructions...')} value={formData.additionalNotes} onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))} rows={3} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"/>
            </div>

            {calculatedWithdrawal && (<Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Calculator className="w-4 h-4 mr-2"/>
                    {t('Withdrawal Period Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-green-800 dark:text-green-300">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2"/>
                      <strong>{t('Withdrawal Period')}:</strong> {calculatedWithdrawal.days} {t('days')}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2"/>
                      <strong>{t('Safe for consumption after')}:</strong> {calculatedWithdrawal.endDate}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2"/>
                      <strong>{t('Category')}:</strong> {t(calculatedWithdrawal.category)}
                    </div>
                  </div>
                </CardContent>
              </Card>)}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                {t('Cancel')}
              </Button>
              <Button type="submit" disabled={loading || !calculatedWithdrawal} className="btn-gradient-primary">
                {loading ? (<>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    {t('Creating...')}
                  </>) : (<>
                    <Pill className="w-4 h-4 mr-2"/>
                    {t('Create Prescription')}
                  </>)}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>);
};
export default PrescriptionDialog;
