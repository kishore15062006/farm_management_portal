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

interface NewTreatmentDialogProps {
  children?: React.ReactNode;
}

const NewTreatmentDialog = ({ children }: NewTreatmentDialogProps) => {
  const { user } = useAuth();
  const { addTreatment } = useTreatments();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    animalId: '',
    drug: '',
    dosage: '',
    route: '',
    frequency: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates.",
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
      status: 'pending' as const,
      farmerId: user.id,
      farmerName: user.name || 'Unknown Farmer',
      farmName: (user as any).farmName || 'Unknown Farm',
      submittedDate: new Date().toISOString()
    };

    // Add treatment to context
    addTreatment(treatment);

    toast({
      title: "Treatment recorded",
      description: "New antimicrobial treatment has been submitted for approval.",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="btn-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Treatment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Antimicrobial Treatment</DialogTitle>
          <DialogDescription>
            Record a new antimicrobial usage event for your animals.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalId">Animal ID</Label>
              <Input
                id="animalId"
                placeholder="e.g., Cattle #247"
                value={formData.animalId}
                onChange={(e) => handleInputChange('animalId', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drug">Antimicrobial Drug</Label>
              <Select value={formData.drug} onValueChange={(value) => handleInputChange('drug', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select drug" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                  <SelectItem value="oxytetracycline">Oxytetracycline</SelectItem>
                  <SelectItem value="penicillin">Penicillin</SelectItem>
                  <SelectItem value="enrofloxacin">Enrofloxacin</SelectItem>
                  <SelectItem value="ceftiofur">Ceftiofur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 10mg/kg"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="route">Route of Administration</Label>
              <Select value={formData.route} onValueChange={(value) => handleInputChange('route', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oral">Oral</SelectItem>
                  <SelectItem value="injection">Injection (IM/IV)</SelectItem>
                  <SelectItem value="topical">Topical</SelectItem>
                  <SelectItem value="feed">Feed Additive</SelectItem>
                  <SelectItem value="water">Water Additive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once-daily">Once Daily</SelectItem>
                <SelectItem value="twice-daily">Twice Daily</SelectItem>
                <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                <SelectItem value="once-weekly">Once Weekly</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the treatment..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient-primary">
              Record Treatment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTreatmentDialog;