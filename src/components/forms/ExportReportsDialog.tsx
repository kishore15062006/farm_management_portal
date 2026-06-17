import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExportReportsDialog = () => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('');
  const [dataType, setDataType] = useState('');
  const [includeFarms, setIncludeFarms] = useState(true);
  const [includeTreatments, setIncludeTreatments] = useState(true);
  const [includeCompliance, setIncludeCompliance] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock export
    console.log('Exporting:', { format, dataType, includeFarms, includeTreatments, includeCompliance });
    
    toast({
      title: "Export Started",
      description: `Your ${format.toUpperCase()} export will download shortly.`,
      variant: "sky"
    });

    setOpen(false);
    setFormat('');
    setDataType('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient-primary">
          <Download className="w-4 h-4 mr-2" />
          Export Reports
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Reports</DialogTitle>
          <DialogDescription>
            Export regulatory data in your preferred format.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataType">Data Range</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
                <SelectItem value="quarterly">Quarterly Report</SelectItem>
                <SelectItem value="violations">Violations Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include Data</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="farms"
                checked={includeFarms}
                onCheckedChange={(checked) => setIncludeFarms(checked === true)}
              />
              <Label htmlFor="farms">Farm information</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="treatments"
                checked={includeTreatments}
                onCheckedChange={(checked) => setIncludeTreatments(checked === true)}
              />
              <Label htmlFor="treatments">Treatment records</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="compliance"
                checked={includeCompliance}
                onCheckedChange={(checked) => setIncludeCompliance(checked === true)}
              />
              <Label htmlFor="compliance">Compliance violations</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!format || !dataType}>
              Export
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportsDialog;