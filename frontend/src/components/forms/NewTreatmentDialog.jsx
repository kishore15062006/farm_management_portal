import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

const NewTreatmentDialog = ({ children }) => {
    const { user } = useAuth();
    const { addTreatment } = useTreatments();
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        animalId: '',
        drug: '',
        dosage: '',
        route: '',
        frequency: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: t("Error"),
                description: t("User not authenticated"),
                variant: "destructive"
            });
            return;
        }
        if (!startDate || !endDate) {
            toast({
                title: t("Missing dates"),
                description: t("Please select both start and end dates."),
                variant: "destructive"
            });
            return;
        }
        // Create treatment object
        const treatment = {
            id: `TREAT-${Date.now()}`,
            animalId: formData.animalId,
            animalType: 'cattle', // Default for quick treatment
            drug: formData.drug,
            dosage: formData.dosage,
            route: formData.route,
            frequency: formData.frequency,
            duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)).toString(),
            reason: formData.notes || 'Treatment via quick form',
            vetPrescription: '',
            batchNumber: '',
            startDate: startDate.toISOString(),
            withdrawalDate: endDate.toISOString(),
            status: 'pending',
            farmerId: user.id,
            farmerName: user.name || 'Unknown Farmer',
            farmName: user.farmName || user.organization || 'Unknown Farm',
            submittedDate: new Date().toISOString()
        };
        // Add treatment to context
        addTreatment(treatment);
        toast({
            title: t("Treatment recorded"),
            description: t("New antimicrobial treatment has been submitted for approval."),
            variant: "sky"
        });
        // Reset form
        setFormData({
            animalId: '',
            drug: '',
            dosage: '',
            route: '',
            frequency: '',
            notes: ''
        });
        setStartDate(undefined);
        setEndDate(undefined);
        setOpen(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (<Button className="btn-gradient-primary">
            <Plus className="w-4 h-4 mr-2"/>
            {t('New Treatment')}
          </Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('New Antimicrobial Treatment')}</DialogTitle>
          <DialogDescription>
            {t('Record a new antimicrobial usage event for your animals.')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalId">{t('Animal ID')}</Label>
              <Input id="animalId" placeholder={t('e.g., Cattle #247')} value={formData.animalId} onChange={(e) => handleInputChange('animalId', e.target.value)} required/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drug">{t('Antimicrobial Drug')}</Label>
              <Select value={formData.drug} onValueChange={(value) => handleInputChange('drug', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select drug')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amoxicillin">{t('Amoxicillin')}</SelectItem>
                  <SelectItem value="oxytetracycline">{t('Oxytetracycline')}</SelectItem>
                  <SelectItem value="penicillin">{t('Penicillin')}</SelectItem>
                  <SelectItem value="enrofloxacin">{t('Enrofloxacin')}</SelectItem>
                  <SelectItem value="ceftiofur">{t('Ceftiofur')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">{t('Dosage')}</Label>
              <Input id="dosage" placeholder={t('e.g., 10mg/kg')} value={formData.dosage} onChange={(e) => handleInputChange('dosage', e.target.value)} required/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="route">{t('Route of Administration')}</Label>
              <Select value={formData.route} onValueChange={(value) => handleInputChange('route', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select route')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oral">{t('Oral')}</SelectItem>
                  <SelectItem value="injection">{t('Injection (IM/IV)')}</SelectItem>
                  <SelectItem value="topical">{t('Topical')}</SelectItem>
                  <SelectItem value="feed">{t('Feed Additive')}</SelectItem>
                  <SelectItem value="water">{t('Water Additive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">{t('Frequency')}</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t('Select frequency')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once-daily">{t('Once Daily')}</SelectItem>
                <SelectItem value="twice-daily">{t('Twice Daily')}</SelectItem>
                <SelectItem value="three-times-daily">{t('Three Times Daily')}</SelectItem>
                <SelectItem value="once-weekly">{t('Once Weekly')}</SelectItem>
                <SelectItem value="as-needed">{t('As Needed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('Start Date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {startDate ? format(startDate, "PPP") : <span>{t('Pick a date')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto"/>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('End Date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {endDate ? format(endDate, "PPP") : <span>{t('Pick a date')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto"/>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('Notes (Optional)')}</Label>
            <Textarea id="notes" placeholder={t('Additional notes about the treatment...')} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} rows={3}/>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="btn-gradient-primary">
              {t('Record Treatment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);
};
export default NewTreatmentDialog;
