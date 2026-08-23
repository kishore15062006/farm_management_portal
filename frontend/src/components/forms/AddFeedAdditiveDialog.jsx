import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Package } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFeedAdditives } from '@/contexts/FeedAdditiveContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

const AddFeedAdditiveDialog = ({ children }) => {
    const { addFeedAdditive } = useFeedAdditives();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        feedType: '',
        drug: '',
        batchNumber: '',
        quantity: '',
        unit: '',
        concentration: '',
        supplier: '',
        notes: '',
        animalGroup: '',
        totalAnimals: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast({
                title: t("Missing dates"),
                description: t("Please select both start and end dates."),
                variant: "destructive"
            });
            return;
        }
        
        const withdrawalPeriodDays = 7;
        const end = new Date(endDate);
        const withdrawal = new Date(end.getTime() + withdrawalPeriodDays * 24 * 60 * 60 * 1000);

        try {
            await addFeedAdditive({
                farmerId: user?.id || "farmer_001",
                farmerName: user?.name || "Farmer Joe",
                farmName: user?.farmName || user?.organization || 'Unknown Farm',
                feedType: formData.feedType,
                drug: formData.drug,
                batchNumber: formData.batchNumber,
                quantity: formData.quantity,
                unit: formData.unit,
                concentration: formData.concentration,
                supplier: formData.supplier,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                withdrawalDate: withdrawal.toISOString().split('T')[0],
                animalGroup: formData.animalGroup,
                totalAnimals: parseInt(formData.totalAnimals) || 1,
                status: "pending",
                purpose: "Growth & Prevention",
                notes: formData.notes
            });
            toast({
                title: t("Feed additive requested"),
                description: t("Medicated feed usage request submitted for vet approval."),
                variant: "sky"
            });
            // Reset form
            setFormData({
                feedType: '',
                drug: '',
                batchNumber: '',
                quantity: '',
                unit: '',
                concentration: '',
                supplier: '',
                notes: '',
                animalGroup: '',
                totalAnimals: ''
            });
            setStartDate(undefined);
            setEndDate(undefined);
            setOpen(false);
        } catch (error) {
            toast({
                title: t("Error logging additive"),
                description: t("Failed to record medicated feed usage."),
                variant: "destructive"
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (<Button variant="outline">
            <Package className="w-4 h-4 mr-2"/>
            {t('Add Feed Additive')}
          </Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Add Medicated Feed Usage')}</DialogTitle>
          <DialogDescription>
            {t('Record medicated feed additive usage for livestock.')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedType">{t('Feed Type')}</Label>
              <Select value={formData.feedType} onValueChange={(value) => handleInputChange('feedType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select feed type')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">{t('Starter Feed')}</SelectItem>
                  <SelectItem value="grower">{t('Grower Feed')}</SelectItem>
                  <SelectItem value="finisher">{t('Finisher Feed')}</SelectItem>
                  <SelectItem value="layer">{t('Layer Feed')}</SelectItem>
                  <SelectItem value="dairy">{t('Dairy Feed')}</SelectItem>
                  <SelectItem value="beef">{t('Beef Feed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drug">{t('Antimicrobial Drug')}</Label>
              <Select value={formData.drug} onValueChange={(value) => handleInputChange('drug', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select drug')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bacitracin">{t('Bacitracin')}</SelectItem>
                  <SelectItem value="virginiamycin">{t('Virginiamycin')}</SelectItem>
                  <SelectItem value="salinomycin">{t('Salinomycin')}</SelectItem>
                  <SelectItem value="monensin">{t('Monensin')}</SelectItem>
                  <SelectItem value="tylosin">{t('Tylosin')}</SelectItem>
                  <SelectItem value="chlortetracycline">{t('Chlortetracycline')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">{t('Batch Number')}</Label>
              <Input id="batchNumber" placeholder={t('e.g., BT2024001')} value={formData.batchNumber} onChange={(e) => handleInputChange('batchNumber', e.target.value)} required/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">{t('Supplier')}</Label>
              <Input id="supplier" placeholder={t('Feed supplier name')} value={formData.supplier} onChange={(e) => handleInputChange('supplier', e.target.value)} required/>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('Quantity')}</Label>
              <Input id="quantity" placeholder={t('e.g., 500')} type="number" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} required/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">{t('Unit')}</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('Unit')}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">{t('Kilograms (kg)')}</SelectItem>
                  <SelectItem value="tons">{t('Tons')}</SelectItem>
                  <SelectItem value="lbs">{t('Pounds (lbs)')}</SelectItem>
                  <SelectItem value="bags">{t('Bags')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concentration">{t('Concentration')}</Label>
              <Input id="concentration" placeholder={t('e.g., 50 ppm')} value={formData.concentration} onChange={(e) => handleInputChange('concentration', e.target.value)} required/>
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalGroup">{t('Animal Group / Lot ID')}</Label>
              <Input id="animalGroup" placeholder={t('e.g., Lot A (Cattle)')} value={formData.animalGroup} onChange={(e) => handleInputChange('animalGroup', e.target.value)} required/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAnimals">{t('Total Animals')}</Label>
              <Input id="totalAnimals" placeholder={t('e.g., 50')} type="number" value={formData.totalAnimals} onChange={(e) => handleInputChange('totalAnimals', e.target.value)} required/>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('Notes (Optional)')}</Label>
            <Textarea id="notes" placeholder={t('Additional notes about the feed additive usage...')} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} rows={3}/>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button type="submit" className="btn-gradient-primary">
              {t('Record Feed Usage')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);
};
export default AddFeedAdditiveDialog;
