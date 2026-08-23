import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

const TreatmentContext = createContext(undefined);

export const useTreatments = () => {
    const context = useContext(TreatmentContext);
    if (!context) {
        throw new Error('useTreatments must be used within a TreatmentProvider');
    }
    return context;
};

export const TreatmentProvider = ({ children }) => {
    const [treatments, setTreatments] = useState([]);
    const { addNotification } = useNotifications();
    const { user } = useAuth();

    // Load treatments from backend on mount or user change
    useEffect(() => {
        if (!user) {
            setTreatments([]);
            return;
        }

        const fetchTreatments = async () => {
            try {
                let data = [];
                if (user.role === 'farmer') {
                    data = await api.treatments.getByFarmer(user.id);
                } else {
                    data = await api.treatments.getAll();
                }
                setTreatments(data);
            } catch (error) {
                console.error('Failed to load treatments from backend:', error);
            }
        };

        fetchTreatments();
    }, [user]);

    const addTreatment = async (treatment) => {
        try {
            const savedTreatment = await api.treatments.create(treatment);
            setTreatments(prev => [savedTreatment, ...prev]);

            if (savedTreatment.status === 'pending') {
                try {
                    await addNotification({
                        type: 'treatment_pending',
                        title: 'New Treatment Pending Approval',
                        message: `A new treatment for ${savedTreatment.animalId} (${savedTreatment.drug}) requires approval.`,
                        priority: 'high',
                        farmerId: savedTreatment.farmerId,
                        treatmentId: savedTreatment.id,
                        relatedData: {
                            animalId: savedTreatment.animalId,
                            drug: savedTreatment.drug,
                            farmName: savedTreatment.farmName,
                            farmerName: savedTreatment.farmerName
                        }
                    });
                } catch (e) {
                    // no-op
                }
            }

            // Notify farmer when prescription is received (status 'approved')
            if (savedTreatment.status === 'approved') {
                try {
                    await addNotification({
                        type: 'prescription_given',
                        title: 'Prescription Received',
                        message: `A prescription for ${savedTreatment.animalId} (${savedTreatment.drug}) has been approved.`,
                        priority: 'medium',
                        farmerId: savedTreatment.farmerId,
                        veterinarianId: savedTreatment.veterinarianId,
                        treatmentId: savedTreatment.id,
                        relatedData: {
                            animalId: savedTreatment.animalId,
                            drug: savedTreatment.drug,
                            vetPrescription: savedTreatment.vetPrescription
                        }
                    });
                } catch (e) {
                    // no-op
                }
            }

            // Notify farmer if withdrawal period is within 2 days
            const withdrawalDate = new Date(savedTreatment.withdrawalDate);
            const now = new Date();
            const diffDays = Math.ceil((withdrawalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 0 && diffDays <= 2) {
                try {
                    await addNotification({
                        type: 'withdrawal_alert',
                        title: 'Withdrawal Period Ending Soon',
                        message: `Withdrawal period for ${savedTreatment.animalId} (${savedTreatment.drug}) ends in ${diffDays} day(s).`,
                        priority: 'high',
                        farmerId: savedTreatment.farmerId,
                        veterinarianId: savedTreatment.veterinarianId,
                        treatmentId: savedTreatment.id,
                        relatedData: {
                            animalId: savedTreatment.animalId,
                            drug: savedTreatment.drug,
                            withdrawalDate: savedTreatment.withdrawalDate
                        }
                    });
                } catch (e) {
                    // no-op
                }
            }
        } catch (error) {
            console.error('Failed to add treatment:', error);
            throw error;
        }
    };

    const updateTreatment = async (treatmentId, updates) => {
        try {
            const updatedTreatment = await api.treatments.update(treatmentId, updates);
            setTreatments(prev => prev.map(treatment => treatment.id === treatmentId
                ? updatedTreatment
                : treatment));
        } catch (error) {
            console.error('Failed to update treatment:', error);
            throw error;
        }
    };

    const deleteTreatment = async (treatmentId) => {
        try {
            await api.treatments.delete(treatmentId);
            setTreatments(prev => prev.filter(treatment => treatment.id !== treatmentId));
        } catch (error) {
            console.error('Failed to delete treatment:', error);
            throw error;
        }
    };

    const getTreatmentsByFarmer = (farmerId) => {
        return treatments.filter(treatment => treatment.farmerId === farmerId);
    };

    const getPendingTreatments = () => {
        return treatments.filter(treatment => treatment.status === 'pending');
    };

    const getApprovedTreatments = (farmerId) => {
        return treatments.filter(treatment => treatment.farmerId === farmerId && treatment.status === 'approved');
    };

    return (<TreatmentContext.Provider value={{
            treatments,
            addTreatment,
            updateTreatment,
            deleteTreatment,
            getTreatmentsByFarmer,
            getPendingTreatments,
            getApprovedTreatments
        }}>
      {children}
    </TreatmentContext.Provider>);
};
