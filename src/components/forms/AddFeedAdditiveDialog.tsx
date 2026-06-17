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

interface AddFeedAdditiveDialogProps {
  children?: React.ReactNode;
}

const AddFeedAdditiveDialog = ({ children }: AddFeedAdditiveDialogProps) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    feedType: '',
    drug: '',
    batchNumber: '',
    quantity: '',
    unit: '',
    concentration: '',
    supplier: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    toast({
      title: "Feed additive recorded",
      description: "Medicated feed usage has been logged successfully.",
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
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Add Feed Additive
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Medicated Feed Usage</DialogTitle>
          <DialogDescription>
            Record medicated feed additive usage for livestock.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedType">Feed Type</Label>
              <Select value={formData.feedType} onValueChange={(value) => handleInputChange('feedType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select feed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter Feed</SelectItem>
                  <SelectItem value="grower">Grower Feed</SelectItem>
                  <SelectItem value="finisher">Finisher Feed</SelectItem>
                  <SelectItem value="layer">Layer Feed</SelectItem>
                  <SelectItem value="dairy">Dairy Feed</SelectItem>
                  <SelectItem value="beef">Beef Feed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drug">Antimicrobial Drug</Label>
              <Select value={formData.drug} onValueChange={(value) => handleInputChange('drug', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select drug" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bacitracin">Bacitracin</SelectItem>
                  <SelectItem value="virginiamycin">Virginiamycin</SelectItem>
                  <SelectItem value="salinomycin">Salinomycin</SelectItem>
                  <SelectItem value="monensin">Monensin</SelectItem>
                  <SelectItem value="tylosin">Tylosin</SelectItem>
                  <SelectItem value="chlortetracycline">Chlortetracycline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                placeholder="e.g., BT2024001"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                placeholder="Feed supplier name"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                placeholder="e.g., 500"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concentration">Concentration</Label>
              <Input
                id="concentration"
                placeholder="e.g., 50 ppm"
                value={formData.concentration}
                onChange={(e) => handleInputChange('concentration', e.target.value)}
                required
              />
            </div>
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
              placeholder="Additional notes about the feed additive usage..."
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
              Record Feed Usage
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeedAdditiveDialog;