import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, FileText, Pill, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CattleProblem {
  id: string;
  cattleId: string;
  cattleTag: string;
  problem: string;
  symptoms: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  status: 'pending' | 'under_review' | 'prescribed' | 'resolved';
  farmerId: string;
  farmerName: string;
  farmName: string;
  veterinarianId?: string;
  prescription?: {
    id: string;
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
    withdrawalPeriod: number;
    prescribedDate: string;
  };
}

interface PrescriptionDialogProps {
  problem: CattleProblem;
  onPrescriptionGiven: (problemId: string, prescription: {
    id: string;
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
    withdrawalPeriod: number;
    prescribedDate: string;
    additionalNotes?: string;
  }) => void;
  children: React.ReactNode;
}

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

const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({ 
  problem, 
  onPrescriptionGiven, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    duration: '',
    instructions: '',
    additionalNotes: ''
  });

  const [calculatedWithdrawal, setCalculatedWithdrawal] = useState<{
    days: number;
    category: string;
    endDate: string;
  } | null>(null);

  const calculateWithdrawalPeriod = (medication: string) => {
    const amuData = AMU_WITHDRAWAL_DB[medication as keyof typeof AMU_WITHDRAWAL_DB];
    if (amuData) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + amuData.days);
      
      setCalculatedWithdrawal({
        days: amuData.days,
        category: amuData.category,
        endDate: endDate.toISOString().split('T')[0]
      });
    } else {
      setCalculatedWithdrawal(null);
    }
  };

  const handleMedicationChange = (medication: string) => {
    setFormData(prev => ({ ...prev, medication }));
    calculateWithdrawalPeriod(medication);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
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
        title: "Prescription Created Successfully",
        description: `Prescription for ${problem.cattleTag} has been created with ${calculatedWithdrawal?.days || 0} days withdrawal period.`,
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'status-danger';
      case 'high': return 'status-warning';
      case 'medium': return 'status-info';
      case 'low': return 'status-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Pill className="w-5 h-5 mr-2 text-primary" />
            Create Prescription
          </DialogTitle>
          <DialogDescription>
            Provide prescription for {problem.cattleTag} - {problem.problem}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Problem Summary */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Problem Summary</span>
                <Badge className={getSeverityColor(problem.severity)}>
                  {problem.severity.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div><strong>Farm:</strong> {problem.farmName}</div>
                <div><strong>Farmer:</strong> {problem.farmerName}</div>
                <div><strong>Problem:</strong> {problem.problem}</div>
                <div><strong>Symptoms:</strong> {problem.symptoms}</div>
                <div><strong>Reported:</strong> {new Date(problem.reportedDate).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Medication *</Label>
                <Select
                  value={formData.medication}
                  onValueChange={handleMedicationChange}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(AMU_WITHDRAWAL_DB).map((med) => (
                      <SelectItem key={med} value={med}>
                        <div className="flex items-center justify-between w-full">
                          <span>{med}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {AMU_WITHDRAWAL_DB[med as keyof typeof AMU_WITHDRAWAL_DB].category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 500mg, 2ml/kg"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 7 days, 2 weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Withdrawal Period</Label>
                <div className="p-3 bg-info/10 border border-info/20 rounded-md">
                  {calculatedWithdrawal ? (
                    <div className="text-sm">
                      <div className="font-medium text-info">
                        {calculatedWithdrawal.days} days
                      </div>
                      <div className="text-info/80">
                        Category: {calculatedWithdrawal.category}
                      </div>
                      <div className="text-info/80">
                        Safe for consumption: {calculatedWithdrawal.endDate}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Select medication to calculate withdrawal period
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Administration Instructions *</Label>
              <Textarea
                id="instructions"
                placeholder="Detailed instructions for administering the medication..."
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                required
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional recommendations or follow-up instructions..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                rows={3}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {calculatedWithdrawal && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Withdrawal Period Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <strong>Withdrawal Period:</strong> {calculatedWithdrawal.days} days
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <strong>Safe for consumption after:</strong> {calculatedWithdrawal.endDate}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <strong>Category:</strong> {calculatedWithdrawal.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !calculatedWithdrawal}
                className="btn-gradient-primary"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Pill className="w-4 h-4 mr-2" />
                    Create Prescription
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDialog;
