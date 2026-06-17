
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

export interface Treatment {
  id: string;
  animalId: string;
  animalType: string;
  drug: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  reason: string;
  vetPrescription: string;
  batchNumber: string;
  startDate: string;
  withdrawalDate: string;
  status: 'pending' | 'approved' | 'rejected';
  farmerId: string;
  farmerName: string;
  farmName: string;
  veterinarianId?: string;
  veterinarianName?: string;
  submittedDate: string;
  approvedDate?: string;
  rejectionReason?: string;
}

interface TreatmentContextType {
  treatments: Treatment[];
  addTreatment: (treatment: Treatment) => void;
  updateTreatment: (treatmentId: string, updates: Partial<Treatment>) => void;
  getTreatmentsByFarmer: (farmerId: string) => Treatment[];
  getPendingTreatments: () => Treatment[];
  getApprovedTreatments: (farmerId: string) => Treatment[];
}

const TreatmentContext = createContext<TreatmentContextType | undefined>(undefined);

export const useTreatments = () => {
  const context = useContext(TreatmentContext);
  if (!context) {
    throw new Error('useTreatments must be used within a TreatmentProvider');
  }
  return context;
};


export const TreatmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const { addNotification } = useNotifications();

  // Load treatments from localStorage on mount
  useEffect(() => {
    const storedTreatments = localStorage.getItem('treatments');
    if (storedTreatments) {
      try {
        setTreatments(JSON.parse(storedTreatments));
      } catch (error) {
        console.error('Failed to load treatments from localStorage:', error);
      }
    }
  }, []);

  // Save treatments to localStorage whenever treatments change
  useEffect(() => {
    localStorage.setItem('treatments', JSON.stringify(treatments));
  }, [treatments]);

  const addTreatment = (treatment: Treatment) => {
    setTreatments(prev => [treatment, ...prev]);
    // Notify farmer when prescription is received (status 'approved')
    if (treatment.status === 'approved') {
      addNotification({
        type: 'prescription_given',
        title: 'Prescription Received',
        message: `A prescription for ${treatment.animalId} (${treatment.drug}) has been approved.`,
        priority: 'medium',
        farmerId: treatment.farmerId,
        veterinarianId: treatment.veterinarianId,
        treatmentId: treatment.id,
        relatedData: {
          animalId: treatment.animalId,
          drug: treatment.drug,
          vetPrescription: treatment.vetPrescription
        }
      });
    }
    // Notify farmer if withdrawal period is within 2 days
    const withdrawalDate = new Date(treatment.withdrawalDate);
    const now = new Date();
    const diffDays = Math.ceil((withdrawalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 2) {
      addNotification({
        type: 'withdrawal_alert',
        title: 'Withdrawal Period Ending Soon',
        message: `Withdrawal period for ${treatment.animalId} (${treatment.drug}) ends in ${diffDays} day(s).`,
        priority: 'high',
        farmerId: treatment.farmerId,
        veterinarianId: treatment.veterinarianId,
        treatmentId: treatment.id,
        relatedData: {
          animalId: treatment.animalId,
          drug: treatment.drug,
          withdrawalDate: treatment.withdrawalDate
        }
      });
    }
  };

  const updateTreatment = (treatmentId: string, updates: Partial<Treatment>) => {
    setTreatments(prev => 
      prev.map(treatment => 
        treatment.id === treatmentId 
          ? { ...treatment, ...updates }
          : treatment
      )
    );
  };

  const getTreatmentsByFarmer = (farmerId: string) => {
    return treatments.filter(treatment => treatment.farmerId === farmerId);
  };

  const getPendingTreatments = () => {
    return treatments.filter(treatment => treatment.status === 'pending');
  };

  const getApprovedTreatments = (farmerId: string) => {
    return treatments.filter(treatment => 
      treatment.farmerId === farmerId && treatment.status === 'approved'
    );
  };

  return (
    <TreatmentContext.Provider value={{
      treatments,
      addTreatment,
      updateTreatment,
      getTreatmentsByFarmer,
      getPendingTreatments,
      getApprovedTreatments
    }}>
      {children}
    </TreatmentContext.Provider>
  );
};
