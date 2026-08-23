import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { t } = useTranslation();
    const { user } = useAuth();

    // Load notifications from backend on mount or user change
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const data = await api.notifications.getByUser(user.id, user.role);
                setNotifications(data);
            } catch (error) {
                console.error('Failed to load notifications from backend:', error);
            }
        };

        fetchNotifications();
    }, [user]);

    const addNotification = async (notificationData) => {
        try {
            const saved = await api.notifications.create(notificationData);
            setNotifications(prev => [saved, ...prev]);
        } catch (error) {
            console.error('Failed to save notification to backend:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const updated = await api.notifications.markAsRead(notificationId);
            setNotifications(prev => prev.map(notification => notification.id === notificationId
                ? updated
                : notification));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            await api.notifications.markAllAsRead(user.id, user.role);
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const getNotificationsByUser = (userId, role) => {
        if (role === 'farmer') {
            return notifications.filter(notification => notification.farmerId === userId);
        }
        if (role === 'veterinarian') {
            return notifications.filter(notification => notification.veterinarianId === userId ||
                (notification.type === 'problem_reported' && !notification.veterinarianId) ||
                (notification.type === 'treatment_pending' && !notification.veterinarianId));
        }
        if (role === 'regulator') {
            return notifications.filter(notification => notification.type === 'compliance_alert' ||
                notification.type === 'withdrawal_alert' ||
                notification.type === 'problem_reported');
        }
        return [];
    };

    const getUnreadCount = (userId, role) => {
        return getNotificationsByUser(userId, role).filter(notification => !notification.read).length;
    };

    const clearNotifications = async () => {
        try {
            await api.notifications.clear();
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const createWithdrawalAlert = async (prescription, problem) => {
        const withdrawalEndDate = new Date(prescription.prescribedDate);
        withdrawalEndDate.setDate(withdrawalEndDate.getDate() + prescription.withdrawalPeriod);
        const now = new Date();
        const daysRemaining = Math.ceil((withdrawalEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let priority = 'low';
        let title = '';
        let message = '';
        
        if (daysRemaining <= 1) {
            priority = 'critical';
            title = t('notifications.withdrawalPeriodEndingToday.title');
            message = t('notifications.withdrawalPeriodEndingToday.message', {
                cattleTag: problem.cattleTag,
                medication: prescription.medication,
                date: withdrawalEndDate.toLocaleDateString()
            });
        }
        else if (daysRemaining <= 2) {
            priority = 'high';
            title = t('notifications.withdrawalPeriodEndingSoon.title');
            message = t('notifications.withdrawalPeriodEndingSoon.message', {
                cattleTag: problem.cattleTag,
                medication: prescription.medication,
                daysRemaining,
                date: withdrawalEndDate.toLocaleDateString()
            });
        }
        else if (daysRemaining <= 5) {
            priority = 'medium';
            title = t('notifications.withdrawalPeriodActive.title');
            message = t('notifications.withdrawalPeriodActive.message', {
                cattleTag: problem.cattleTag,
                medication: prescription.medication,
                daysRemaining
            });
        }
        else {
            priority = 'low';
            title = t('notifications.withdrawalPeriodStarted.title');
            message = t('notifications.withdrawalPeriodStarted.message', {
                cattleTag: problem.cattleTag,
                medication: prescription.medication,
                daysRemaining
            });
        }
        
        const notification = {
            type: 'withdrawal_alert',
            title,
            message,
            read: false,
            priority,
            farmerId: problem.farmerId,
            problemId: problem.id,
            dueDate: withdrawalEndDate.toISOString().split('T')[0],
            cattleTag: problem.cattleTag,
            medication: prescription.medication,
            withdrawalEndDate: withdrawalEndDate.toISOString(),
            relatedData: {
                prescription,
                problem,
                daysRemaining
            }
        };

        try {
            const saved = await api.notifications.create(notification);
            setNotifications(prev => [saved, ...prev]);
        } catch (error) {
            console.error('Failed to create withdrawal alert:', error);
        }
    };

    const getActiveWithdrawalAlerts = (farmerId) => {
        const now = new Date();
        return notifications.filter(notification => notification.farmerId === farmerId &&
            notification.type === 'withdrawal_alert' &&
            notification.withdrawalEndDate &&
            new Date(notification.withdrawalEndDate) > now);
    };

    return (<NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            getNotificationsByUser,
            getUnreadCount,
            clearNotifications,
            createWithdrawalAlert,
            getActiveWithdrawalAlerts
        }}>
      {children}
    </NotificationContext.Provider>);
};
