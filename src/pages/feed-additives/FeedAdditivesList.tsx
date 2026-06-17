import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Search, Filter, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeedAdditivesList = () => {
  const { t } = useTranslation();
  // Mock feed additives data
  const feedAdditives = [
    {
      id: 1,
      drug: t('feedAdditives.drugs.chlortetracycline'),
      batchNumber: t('feedAdditives.batchNumbers.CT2024-001'),
      quantity: t('feedAdditives.quantities.50kg'),
      concentration: t('feedAdditives.concentrations.220g/ton'),
      startDate: t('feedAdditives.dates.2024-01-15'),
      endDate: t('feedAdditives.dates.2024-01-20'),
      withdrawalDate: t('feedAdditives.dates.2024-01-27'),
      animalGroup: t('feedAdditives.animalGroups.pigsBarn2'),
      totalAnimals: 45,
      status: t('feedAdditives.statuses.active'),
      purpose: t('feedAdditives.purposes.growthPromotion')
    },
    {
      id: 2,
      drug: t('feedAdditives.drugs.tylosin'),
      batchNumber: t('feedAdditives.batchNumbers.TY2024-003'),
      quantity: t('feedAdditives.quantities.25kg'),
      concentration: t('feedAdditives.concentrations.100g/ton'),
      startDate: t('feedAdditives.dates.2024-01-10'),
      endDate: t('feedAdditives.dates.2024-01-17'),
      withdrawalDate: t('feedAdditives.dates.2024-01-24'),
      animalGroup: t('feedAdditives.animalGroups.cattleLotA'),
      totalAnimals: 80,
      status: t('feedAdditives.statuses.completed'),
      purpose: t('feedAdditives.purposes.diseasePrevention')
    },
    {
      id: 3,
      drug: t('feedAdditives.drugs.salinomycin'),
      batchNumber: t('feedAdditives.batchNumbers.SL2024-007'),
      quantity: t('feedAdditives.quantities.30kg'),
      concentration: t('feedAdditives.concentrations.66g/ton'),
      startDate: t('feedAdditives.dates.2024-01-12'),
      endDate: t('feedAdditives.dates.2024-01-19'),
      withdrawalDate: t('feedAdditives.dates.2024-01-26'),
      animalGroup: t('feedAdditives.animalGroups.broilersHouse1'),
      totalAnimals: 200,
      status: t('feedAdditives.statuses.pending'),
      purpose: t('feedAdditives.purposes.coccidiosisPrevention')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t('feedAdditives.statuses.active'): return 'status-success';
      case t('feedAdditives.statuses.pending'): return 'status-warning';
      case t('feedAdditives.statuses.completed'): return 'status-info';
      default: return 'status-info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case t('feedAdditives.statuses.active'): return t('feedAdditives.statuses.active');
      case t('feedAdditives.statuses.pending'): return t('feedAdditives.statuses.pending');
      case t('feedAdditives.statuses.completed'): return t('feedAdditives.statuses.completed');
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('feedAdditives.title')}</h1>
          <p className="text-muted-foreground">{t('feedAdditives.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            {t('feedAdditives.filter')}
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
                  placeholder={t('feedAdditives.searchPlaceholder')}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Additives Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('feedAdditives.summary.activeFeeds')}</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <Package className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('feedAdditives.summary.pendingApproval')}</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <Package className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('feedAdditives.summary.completedThisMonth')}</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <Package className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feed Additives Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            {t('feedAdditives.tableTitle')}
          </CardTitle>
          <CardDescription>{t('feedAdditives.tableDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('feedAdditives.columns.drug')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.batch')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.quantity')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.concentration')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.startDate')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.endDate')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.withdrawal')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.animalGroup')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.animals')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.status')}</TableHead>
                  <TableHead>{t('feedAdditives.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedAdditives.map((additive) => (
                  <TableRow key={additive.id}>
                    <TableCell className="font-medium">{additive.drug}</TableCell>
                    <TableCell>{additive.batchNumber}</TableCell>
                    <TableCell>{additive.quantity}</TableCell>
                    <TableCell>{additive.concentration}</TableCell>
                    <TableCell>{additive.startDate}</TableCell>
                    <TableCell>{additive.endDate}</TableCell>
                    <TableCell>{additive.withdrawalDate}</TableCell>
                    <TableCell>{additive.animalGroup}</TableCell>
                    <TableCell>{additive.totalAnimals}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(additive.status)}>
                        {getStatusText(additive.status)}
                      </Badge>
                    </TableCell>
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

export default FeedAdditivesList;