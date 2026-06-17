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

const GenerateAnalysisDialog = () => {
  const [open, setOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [includeTrends, setIncludeTrends] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeRiskAssessment, setIncludeRiskAssessment] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock analysis generation
    console.log('Generating analysis:', { 
      analysisType, 
      timeframe, 
      includeTrends, 
      includeRecommendations, 
      includeRiskAssessment 
    });
    
    toast({
      title: "Analysis Generated",
      description: "Your comprehensive analysis report is ready for review.",
      variant: "sky"
    });

    setOpen(false);
    setAnalysisType('');
    setTimeframe('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Generate Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Analysis</DialogTitle>
          <DialogDescription>
            Create a comprehensive analytical report with insights and recommendations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analysisType">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage-patterns">Usage Patterns</SelectItem>
                <SelectItem value="compliance-trends">Compliance Trends</SelectItem>
                <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                <SelectItem value="comparative-analysis">Comparative Analysis</SelectItem>
                <SelectItem value="predictive-insights">Predictive Insights</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Analysis Period</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">Last 3 Months</SelectItem>
                <SelectItem value="6-months">Last 6 Months</SelectItem>
                <SelectItem value="1-year">Last Year</SelectItem>
                <SelectItem value="2-years">Last 2 Years</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include in Analysis</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trends"
                checked={includeTrends}
                onCheckedChange={(checked) => setIncludeTrends(checked === true)}
              />
              <Label htmlFor="trends">Trend analysis and forecasting</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={includeRecommendations}
                onCheckedChange={(checked) => setIncludeRecommendations(checked === true)}
              />
              <Label htmlFor="recommendations">Policy recommendations</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="risk"
                checked={includeRiskAssessment}
                onCheckedChange={(checked) => setIncludeRiskAssessment(checked === true)}
              />
              <Label htmlFor="risk">Risk assessment metrics</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!analysisType || !timeframe}>
              Generate Analysis
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateAnalysisDialog;