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
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GenerateReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock report generation
    console.log('Generating report:', { reportType, timeframe, includeCharts, includeSummary });
    
    toast({
      title: "Report Generated",
      description: "Your report has been generated and will be downloaded shortly.",
      variant: "sky"
    });

    setOpen(false);
    setReportType('');
    setTimeframe('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a custom report with your preferred settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance">Compliance Report</SelectItem>
                <SelectItem value="usage">Usage Summary</SelectItem>
                <SelectItem value="approvals">Approvals Report</SelectItem>
                <SelectItem value="violations">Violations Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Time Period</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Report Options</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(checked === true)}
              />
              <Label htmlFor="charts">Include charts and graphs</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="summary"
                checked={includeSummary}
                onCheckedChange={(checked) => setIncludeSummary(checked === true)}
              />
              <Label htmlFor="summary">Include executive summary</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!reportType || !timeframe}>
              Generate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportDialog;