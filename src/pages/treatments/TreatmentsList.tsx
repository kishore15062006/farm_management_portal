import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, Filter, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TreatmentsList = () => {
  const { t } = useTranslation();
  // Mock detailed treatments data
  const treatments = [
    {
      id: 1,
      animalId: 'Cattle #247',
      drug: 'Amoxicillin',
      dosage: '500mg',
      route: 'Intramuscular',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      withdrawalDate: '2024-01-29',
      veterinarian: 'Dr. Sarah Wilson',
      status: 'pending',
      reason: 'Respiratory infection',
      farmer: 'John Farm'
    },
    {
      id: 2,
      animalId: 'Pig #103',
      drug: 'Oxytetracycline',
      dosage: '300mg',
      route: 'Oral',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      withdrawalDate: '2024-01-22',
      veterinarian: 'Dr. Sarah Wilson',
      status: 'approved',
      reason: 'Bacterial infection',
      farmer: 'Mary Johnson'
    },
    {
      id: 3,
      animalId: 'Cattle #156',
      drug: 'Penicillin G',
      dosage: '2000IU',
      route: 'Intramuscular',
      startDate: '2024-01-08',
      endDate: '2024-01-12',
      withdrawalDate: '2024-01-19',
      veterinarian: 'Dr. Mike Roberts',
      status: 'completed',
      reason: 'Foot rot',
      farmer: 'Tom Anderson'
    },
    {
      id: 4,
      animalId: 'Sheep #89',
      drug: 'Sulfamethoxazole',
      dosage: '800mg',
      route: 'Oral',
      startDate: '2024-01-05',
      endDate: '2024-01-10',
      withdrawalDate: '2024-01-17',
      veterinarian: 'Dr. Sarah Wilson',
      status: 'rejected',
      reason: 'Pneumonia',
      farmer: 'Lisa Parker'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'status-success';
      case 'pending': return 'status-warning';
      case 'rejected': return 'status-danger';
      case 'completed': return 'status-info';
      default: return 'status-info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('commonStatuses.approved');
      case 'pending': return t('commonStatuses.pending');
      case 'rejected': return t('commonStatuses.rejected');
      case 'completed': return t('commonStatuses.completed');
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('treatmentsList.title')}</h1>
          <p className="text-muted-foreground">{t('treatmentsList.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder={t('treatmentsList.searchPlaceholder')}
                  className="pl-10"
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
            <Calendar className="w-5 h-5 mr-2" />
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
                {treatments.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell className="font-medium">{treatment.animalId}</TableCell>
                    <TableCell>{treatment.drug}</TableCell>
                    <TableCell>{treatment.dosage}</TableCell>
                    <TableCell>{treatment.route}</TableCell>
                    <TableCell>{treatment.startDate}</TableCell>
                    <TableCell>{treatment.endDate}</TableCell>
                    <TableCell>{treatment.withdrawalDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(treatment.status)}>
                        {getStatusText(treatment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{treatment.veterinarian}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {t('common.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentsList;