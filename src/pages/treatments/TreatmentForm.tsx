import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';

const TreatmentForm = () => {
  const { user } = useAuth();
  const { addTreatment } = useTreatments();
  const [formData, setFormData] = useState({
    animalId: '',
    animalType: '',
    drug: '',
    dosage: '',
    route: '',
    frequency: '',
    duration: '',
    reason: '',
    vetPrescription: '',
    batchNumber: ''
  });
  
  const [startDate, setStartDate] = useState<Date>();
  const [withdrawalDate, setWithdrawalDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  // Mock drug database for withdrawal calculation
  const drugDatabase = {
    'amoxicillin': { withdrawalPeriod: 7, riskLevel: 'low' },
    'oxytetracycline': { withdrawalPeriod: 14, riskLevel: 'medium' },
    'enrofloxacin': { withdrawalPeriod: 21, riskLevel: 'high' },
    'penicillin': { withdrawalPeriod: 5, riskLevel: 'low' }
  };

  const calculateWithdrawalDate = (drug: string, startDate: Date, duration: number) => {
    const drugInfo = drugDatabase[drug.toLowerCase() as keyof typeof drugDatabase];
    if (drugInfo && startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration + drugInfo.withdrawalPeriod);
      return endDate;
    }
    return null;
  };

  const handleDrugChange = (drug: string) => {
    setFormData(prev => ({ ...prev, drug }));
    if (startDate && formData.duration) {
      const calculatedDate = calculateWithdrawalDate(drug, startDate, parseInt(formData.duration));
      if (calculatedDate) {
        setWithdrawalDate(calculatedDate);
      }
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && formData.drug && formData.duration) {
      const calculatedDate = calculateWithdrawalDate(formData.drug, date, parseInt(formData.duration));
      if (calculatedDate) {
        setWithdrawalDate(calculatedDate);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!startDate || !withdrawalDate) {
      toast({
        title: "Error",
        description: "Please ensure all dates are selected",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Create treatment object
    const treatment = {
      id: `TREAT-${Date.now()}`,
      animalId: formData.animalId,
      animalType: formData.animalType,
      drug: formData.drug,
      dosage: formData.dosage,
      route: formData.route,
      frequency: formData.frequency,
      duration: formData.duration,
      reason: formData.reason,
      vetPrescription: formData.vetPrescription,
      batchNumber: formData.batchNumber,
      startDate: startDate.toISOString(),
      withdrawalDate: withdrawalDate.toISOString(),
      status: 'pending' as const,
      farmerId: user.id,
      farmerName: user.name || 'Unknown Farmer',
      farmName: (user as any).farmName || 'Unknown Farm',
      submittedDate: new Date().toISOString()
    };

    // Add treatment to context
    addTreatment(treatment);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Treatment Record Submitted",
      description: "Your treatment record has been submitted for veterinary approval.",
      variant: "sky"
    });

    setLoading(false);
    
    // Reset form
    setFormData({
      animalId: '',
      animalType: '',
      drug: '',
      dosage: '',
      route: '',
      frequency: '',
      duration: '',
      reason: '',
      vetPrescription: '',
      batchNumber: ''
    });
    setStartDate(undefined);
    setWithdrawalDate(undefined);
  };

  const getDrugRiskLevel = (drug: string) => {
    const drugInfo = drugDatabase[drug.toLowerCase() as keyof typeof drugDatabase];
    return drugInfo?.riskLevel || 'unknown';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'status-success';
      case 'medium': return 'status-warning';
      case 'high': return 'status-danger';
      default: return 'status-info';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animation-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Treatment Record</h1>
          <p className="text-muted-foreground">Record antimicrobial usage for regulatory compliance</p>
        </div>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Treatment Details
          </CardTitle>
          <CardDescription>
            Enter all required information for antimicrobial treatment documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Animal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animalId">Animal ID/Tag Number</Label>
                <Input
                  id="animalId"
                  value={formData.animalId}
                  onChange={(e) => setFormData(prev => ({ ...prev, animalId: e.target.value }))}
                  placeholder="e.g., #247, Cow-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="animalType">Animal Type</Label>
                <Select value={formData.animalType} onValueChange={(value) => setFormData(prev => ({ ...prev, animalType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="pig">Pig</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="poultry">Poultry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drug">Antimicrobial Drug</Label>
                <Select value={formData.drug} onValueChange={handleDrugChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                    <SelectItem value="oxytetracycline">Oxytetracycline</SelectItem>
                    <SelectItem value="enrofloxacin">Enrofloxacin</SelectItem>
                    <SelectItem value="penicillin">Penicillin</SelectItem>
                  </SelectContent>
                </Select>
                {formData.drug && (
                  <Badge className={getRiskColor(getDrugRiskLevel(formData.drug))}>
                    {getDrugRiskLevel(formData.drug)} risk
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg, 2ml/kg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="route">Route of Administration</Label>
                <Select value={formData.route} onValueChange={(value) => setFormData(prev => ({ ...prev, route: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="injection">Injection (IM/IV)</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="feed">In Feed</SelectItem>
                    <SelectItem value="water">In Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="three">Three times daily</SelectItem>
                    <SelectItem value="continuous">Continuous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="7"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Treatment Start Date</Label>
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
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Calculated Withdrawal Date</Label>
                <div className="p-3 bg-muted rounded-md flex items-center">
                  {withdrawalDate ? (
                    <span className="text-foreground">{format(withdrawalDate, "PPP")}</span>
                  ) : (
                    <span className="text-muted-foreground">Auto-calculated after input</span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Treatment</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe the condition or symptoms being treated..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vetPrescription">Veterinary Prescription #</Label>
                <Label htmlFor="vetPrescription" className="text-foreground">Veterinary Prescription #</Label>
                <Input
                  id="vetPrescription"
                  value={formData.vetPrescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, vetPrescription: e.target.value }))}
                  placeholder="VET-2024-001"
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Drug Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                  placeholder="BT-240115-AM"
                  required
                />
              </div>
            </div>

            {/* Withdrawal Warning */}
            {formData.drug && getDrugRiskLevel(formData.drug) === 'high' && (
              <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-warning">High Risk Drug Notice</p>
                  <p className="text-sm text-muted-foreground">
                    This drug requires extended withdrawal periods and veterinary approval. 
                    Ensure compliance with all safety protocols.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" className="btn-gradient-primary" disabled={loading}>
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
                Submit for Approval
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentForm;