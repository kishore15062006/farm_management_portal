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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuickApproveDialog = () => {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock submission
    console.log('Quick approval:', { decision, notes });
    
    toast({
      title: "Decision Recorded",
      description: `Treatment ${decision} successfully.`,
      variant: "sky"
    });

    setOpen(false);
    setDecision('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Quick Approve
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Approval</DialogTitle>
          <DialogDescription>
            Make a quick decision on the selected treatment request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decision">Decision</Label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger>
                <SelectValue placeholder="Select your decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approve</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
                <SelectItem value="request-info">Request More Information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any comments or conditions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!decision}>
              Submit Decision
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickApproveDialog;