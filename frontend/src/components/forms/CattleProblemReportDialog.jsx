import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

const CattleProblemReportDialog = ({ onProblemReported }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        cattleTag: '',
        problem: '',
        symptoms: '',
        severity: 'medium',
        additionalNotes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newProblem = {
                id: `problem_${Date.now()}`,
                cattleId: `cattle_${Date.now()}`,
                cattleTag: formData.cattleTag,
                problem: formData.problem,
                symptoms: formData.symptoms,
                severity: formData.severity,
                reportedDate: new Date().toISOString(),
                status: 'pending',
                farmerId: user?.id || 'farmer_001',
                farmerName: user?.name || 'Unknown Farmer',
                farmName: user?.farmName || user?.organization || 'Unknown Farm'
            };
            onProblemReported(newProblem);
            toast({
                title: t("Problem Reported Successfully"),
                description: t("Your cattle problem has been reported and forwarded to veterinarians for review."),
                variant: "sky"
            });
            setFormData({
                cattleTag: '',
                problem: '',
                symptoms: '',
                severity: 'medium',
                additionalNotes: ''
            });
            setOpen(false);
        }
        catch (error) {
            toast({
                title: t("Error"),
                description: t("Failed to report the problem. Please try again."),
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
        <Button className="btn-gradient-primary">
          <Plus className="w-4 h-4 mr-2"/>
          {t('Report Cattle Problem')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-primary"/>
            {t('Report Cattle Problem')}
          </DialogTitle>
          <DialogDescription>
            {t('Report a health issue with your cattle. This will be forwarded to veterinarians for review and prescription.')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cattleTag">{t('Cattle Tag/ID')} *</Label>
              <Input id="cattleTag" placeholder={t('e.g., C001, #247')} value={formData.cattleTag} onChange={(e) => setFormData(prev => ({ ...prev, cattleTag: e.target.value }))} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">{t('Severity Level')} *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder={t('Select severity')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <Badge className={`${getSeverityColor('low')} mr-2`}>{t('Low')}</Badge>
                      {t('Minor issue')}
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <Badge className={`${getSeverityColor('medium')} mr-2`}>{t('Medium')}</Badge>
                      {t('Moderate concern')}
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <Badge className={`${getSeverityColor('high')} mr-2`}>{t('High')}</Badge>
                      {t('Serious condition')}
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center">
                      <Badge className={`${getSeverityColor('critical')} mr-2`}>{t('Critical')}</Badge>
                      {t('Emergency situation')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">{t('Problem/Diagnosis')} *</Label>
            <Input id="problem" placeholder={t('e.g., Respiratory infection, Lameness, Digestive issues')} value={formData.problem} onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">{t('Symptoms Description')} *</Label>
            <Textarea id="symptoms" placeholder={t("Describe the symptoms you've observed in detail...")} value={formData.symptoms} onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))} required rows={4} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">{t('Additional Notes')}</Label>
            <Textarea id="additionalNotes" placeholder={t('Any additional information that might help the veterinarian...')} value={formData.additionalNotes} onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))} rows={3} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"/>
          </div>

          <Card className="bg-info/10 border-info/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <FileText className="w-4 h-4 mr-2"/>
                {t('What happens next?')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-info">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2"/>
                  {t('Your report will be forwarded to available veterinarians')}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2"/>
                  {t('Veterinarian will review and provide prescription')}
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2"/>
                  {t('Withdrawal periods will be calculated automatically')}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="btn-gradient-primary">
              {loading ? (<>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  {t('Reporting...')}
                </>) : (<>
                  <Plus className="w-4 h-4 mr-2"/>
                  {t('Report Problem')}
                </>)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
};
export default CattleProblemReportDialog;
