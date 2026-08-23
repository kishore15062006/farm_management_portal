import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

const FeedAdditiveContext = createContext(undefined);

export const useFeedAdditives = () => {
    const context = useContext(FeedAdditiveContext);
    if (!context) {
        throw new Error('useFeedAdditives must be used within a FeedAdditiveProvider');
    }
    return context;
};

export const FeedAdditiveProvider = ({ children }) => {
    const [feedAdditives, setFeedAdditives] = useState([]);
    const { user } = useAuth();

    // Load feed additives from backend on mount or user change
    useEffect(() => {
        if (!user) {
            setFeedAdditives([]);
            return;
        }

        const fetchFeedAdditives = async () => {
            try {
                let data = [];
                if (user.role === 'farmer') {
                    data = await api.feedAdditives.getByFarmer(user.id);
                } else {
                    data = await api.feedAdditives.getAll();
                }
                setFeedAdditives(data);
            } catch (error) {
                console.error('Failed to load feed additives from backend:', error);
            }
        };

        fetchFeedAdditives();
    }, [user]);

    const addFeedAdditive = async (feedAdditive) => {
        try {
            const savedAdditive = await api.feedAdditives.create(feedAdditive);
            setFeedAdditives(prev => [savedAdditive, ...prev]);
            return savedAdditive;
        } catch (error) {
            console.error('Failed to add feed additive:', error);
            throw error;
        }
    };

    const updateFeedAdditive = async (id, updates) => {
        try {
            const updatedAdditive = await api.feedAdditives.update(id, updates);
            setFeedAdditives(prev => prev.map(additive => additive.id === id
                ? updatedAdditive
                : additive));
            return updatedAdditive;
        } catch (error) {
            console.error('Failed to update feed additive:', error);
            throw error;
        }
    };

    const deleteFeedAdditive = async (id) => {
        try {
            await api.feedAdditives.delete(id);
            setFeedAdditives(prev => prev.filter(additive => additive.id !== id));
        } catch (error) {
            console.error('Failed to delete feed additive:', error);
            throw error;
        }
    };

    const getFeedAdditivesByFarmer = (farmerId) => {
        return feedAdditives.filter(additive => additive.farmerId === farmerId);
    };

    const getPendingFeedAdditives = () => {
        return feedAdditives.filter(additive => additive.status === 'pending');
    };

    return (<FeedAdditiveContext.Provider value={{
            feedAdditives,
            addFeedAdditive,
            updateFeedAdditive,
            deleteFeedAdditive,
            getFeedAdditivesByFarmer,
            getPendingFeedAdditives
        }}>
      {children}
    </FeedAdditiveContext.Provider>);
};
