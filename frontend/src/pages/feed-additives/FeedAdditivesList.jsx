import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Search, Filter, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import AddFeedAdditiveDialog from '@/components/forms/AddFeedAdditiveDialog';
import { useFeedAdditives } from '@/contexts/FeedAdditiveContext';
import { useToast } from '@/hooks/use-toast';

const FeedAdditivesList = () => {
    const { t } = useTranslation();
    const { feedAdditives, deleteFeedAdditive } = useFeedAdditives();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteFeedAdditive = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicated feed record?")) {
            try {
                await deleteFeedAdditive(id);
                toast({
                    title: "Record Deleted",
                    description: "The medicated feed usage record has been successfully deleted.",
                    variant: "sky"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete feed record.",
                    variant: "destructive"
                });
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'status-success';
            case 'pending': return 'status-warning';
            case 'completed': return 'status-info';
            default: return 'status-info';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return t('feedAdditives.statuses.active') || 'Active';
            case 'pending': return t('feedAdditives.statuses.pending') || 'Pending';
            case 'completed': return t('feedAdditives.statuses.completed') || 'Completed';
            default: return status;
        }
    };

    const filteredFeedAdditives = feedAdditives.filter(additive => {
        const query = searchTerm.toLowerCase();
        return (
            (additive.drug && additive.drug.toLowerCase().includes(query)) ||
            (additive.batchNumber && additive.batchNumber.toLowerCase().includes(query)) ||
            (additive.animalGroup && additive.animalGroup.toLowerCase().includes(query)) ||
            (additive.purpose && additive.purpose.toLowerCase().includes(query))
        );
    });

    const activeCount = feedAdditives.filter(f => f.status === 'active').length;
    const pendingCount = feedAdditives.filter(f => f.status === 'pending').length;
    const completedCount = feedAdditives.filter(f => f.status === 'completed').length;

    return (<div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('feedAdditives.title')}</h1>
          <p className="text-muted-foreground">{t('feedAdditives.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <AddFeedAdditiveDialog />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2"/>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                <Input 
                  placeholder={t('feedAdditives.searchPlaceholder')} 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              </div>
              <Package className="w-8 h-8 text-success"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('feedAdditives.summary.pendingApproval')}</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <Package className="w-8 h-8 text-warning"/>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('feedAdditives.summary.completedThisMonth')}</p>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              </div>
              <Package className="w-8 h-8 text-info"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feed Additives Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2"/>
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
                {filteredFeedAdditives.map((additive) => (<TableRow key={additive.id}>
                    <TableCell className="font-medium">{t(additive.drug)}</TableCell>
                    <TableCell>{additive.batchNumber}</TableCell>
                    <TableCell>{additive.quantity} {additive.unit}</TableCell>
                    <TableCell>{additive.concentration}</TableCell>
                    <TableCell>{additive.startDate}</TableCell>
                    <TableCell>{additive.endDate}</TableCell>
                    <TableCell>{additive.withdrawalDate}</TableCell>
                    <TableCell>{t(additive.animalGroup)}</TableCell>
                    <TableCell>{additive.totalAnimals}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(additive.status)}>
                        {t(getStatusText(additive.status))}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFeedAdditive(additive.id)} className="text-destructive hover:bg-destructive/10">
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
export default FeedAdditivesList;
