import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, Filter, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTreatments } from '@/contexts/TreatmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import NewTreatmentDialog from '@/components/forms/NewTreatmentDialog';

const TreatmentsList = () => {
    const { t } = useTranslation();
    const { treatments, deleteTreatment } = useTreatments();
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteTreatment = async (treatmentId) => {
        if (window.confirm("Are you sure you want to delete this treatment record?")) {
            try {
                await deleteTreatment(treatmentId);
                toast({
                    title: "Record Deleted",
                    description: "The treatment record has been successfully deleted.",
                    variant: "sky"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete treatment record.",
                    variant: "destructive"
                });
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'status-success';
            case 'pending': return 'status-warning';
            case 'rejected': return 'status-danger';
            case 'completed': return 'status-info';
            default: return 'status-info';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved': return t('commonStatuses.approved');
            case 'pending': return t('commonStatuses.pending');
            case 'rejected': return t('commonStatuses.rejected');
            case 'completed': return t('commonStatuses.completed');
            default: return status;
        }
    };

    const filteredTreatments = treatments.filter(treatment => {
        const matchesSearch = 
            (treatment.animalId && treatment.animalId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (treatment.drug && treatment.drug.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (treatment.reason && treatment.reason.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const formatLocalDate = (isoString) => {
        if (!isoString) return '';
        try {
            return new Date(isoString).toLocaleDateString();
        } catch (e) {
            return isoString;
        }
    };

    const calculateEndDate = (treatment) => {
        if (!treatment.startDate) return '';
        try {
            const start = new Date(treatment.startDate);
            const durationDays = parseInt(treatment.duration || 0, 10);
            const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
            return end.toLocaleDateString();
        } catch (e) {
            return '';
        }
    };

    return (<div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('treatmentsList.title')}</h1>
          <p className="text-muted-foreground">{t('treatmentsList.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          {user?.role === 'farmer' && (
              <NewTreatmentDialog />
          )}
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2"/>
            {t('treatmentsList.filter')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                <Input 
                  placeholder={t('treatmentsList.searchPlaceholder')} 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatments Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2"/>
            {t('treatmentsList.allTreatments')}
          </CardTitle>
          <CardDescription>{t('treatmentsList.allTreatmentsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('treatmentsList.columns.animalId')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.drug')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.dosage')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.route')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.startDate')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.endDate')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.withdrawal')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.status')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.veterinarian')}</TableHead>
                  <TableHead>{t('treatmentsList.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTreatments.map((treatment) => (<TableRow key={treatment.id}>
                    <TableCell className="font-medium">{treatment.animalId}</TableCell>
                    <TableCell>{t(treatment.drug)}</TableCell>
                    <TableCell>{t(treatment.dosage)}</TableCell>
                    <TableCell>{t(treatment.route)}</TableCell>
                    <TableCell>{formatLocalDate(treatment.startDate)}</TableCell>
                    <TableCell>{calculateEndDate(treatment)}</TableCell>
                    <TableCell>{formatLocalDate(treatment.withdrawalDate)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(treatment.status)}>
                        {t(getStatusText(treatment.status))}
                      </Badge>
                    </TableCell>
                    <TableCell>{t(treatment.veterinarianName) || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTreatment(treatment.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4 mr-1"/>
                          {t('common.delete', 'Delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
};
export default TreatmentsList;
