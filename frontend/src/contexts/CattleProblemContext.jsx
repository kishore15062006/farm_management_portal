import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

const CattleProblemContext = createContext(undefined);

export const useCattleProblems = () => {
    const context = useContext(CattleProblemContext);
    if (!context) {
        throw new Error('useCattleProblems must be used within a CattleProblemProvider');
    }
    return context;
};

export const CattleProblemProvider = ({ children }) => {
    const [problems, setProblems] = useState([]);
    const { addNotification } = useNotifications();
    const { user } = useAuth();

    // Load problems from backend on mount or user change
    useEffect(() => {
        if (!user) {
            setProblems([]);
            return;
        }
        
        const fetchProblems = async () => {
            try {
                let data = [];
                if (user.role === 'farmer') {
                    data = await api.problems.getByFarmer(user.id);
                } else if (user.role === 'veterinarian') {
                    data = await api.problems.getForVet();
                } else if (user.role === 'regulator') {
                    data = await api.problems.getAll();
                }
                setProblems(data);
            } catch (error) {
                console.error('Failed to load cattle problems from backend:', error);
            }
        };

        fetchProblems();
    }, [user]);

    const addProblem = async (problem) => {
        try {
            const savedProblem = await api.problems.create(problem);
            setProblems(prev => [savedProblem, ...prev]);
            
            // Notify veterinarians about new problem reported
            try {
                await addNotification({
                    type: 'problem_reported',
                    title: 'New Problem Reported',
                    message: `${savedProblem.farmerName} reported an issue for ${savedProblem.cattleTag}: ${savedProblem.problem}`,
                    priority: savedProblem.severity === 'critical' || savedProblem.severity === 'high' ? 'high' : 'medium',
                    farmerId: savedProblem.farmerId,
                    problemId: savedProblem.id,
                    relatedData: {
                        cattleTag: savedProblem.cattleTag,
                        farmName: savedProblem.farmName,
                        severity: savedProblem.severity,
                        reportedDate: savedProblem.reportedDate,
                    }
                });
            } catch (e) {
                // no-op
            }
        } catch (error) {
            console.error('Failed to add cattle problem:', error);
            throw error;
        }
    };

    const updateProblem = async (problemId, updates) => {
        try {
            const updatedProblem = await api.problems.update(problemId, updates);
            setProblems(prev => prev.map(problem => problem.id === problemId
                ? updatedProblem
                : problem));
        } catch (error) {
            console.error('Failed to update cattle problem:', error);
            throw error;
        }
    };

    const deleteProblem = async (problemId) => {
        try {
            await api.problems.delete(problemId);
            setProblems(prev => prev.filter(problem => problem.id !== problemId));
        } catch (error) {
            console.error('Failed to delete cattle problem:', error);
            throw error;
        }
    };

    const getProblemsByFarmer = (farmerId) => {
        return problems.filter(problem => problem.farmerId === farmerId);
    };

    const getProblemsForVeterinarian = () => {
        return problems.filter(problem => problem.status === 'pending' || problem.status === 'under_review' || problem.status === 'prescribed');
    };

    return (<CattleProblemContext.Provider value={{
            problems,
            addProblem,
            updateProblem,
            deleteProblem,
            getProblemsByFarmer,
            getProblemsForVeterinarian
        }}>
      {children}
    </CattleProblemContext.Provider>);
};
