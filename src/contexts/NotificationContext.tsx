import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Notification {
  id: string;
  type: 'treatment_approved' | 'treatment_rejected' | 'prescription_given' | 'withdrawal_alert' | 'compliance_alert' | 'problem_reported' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  farmerId?: string;
  veterinarianId?: string;
  treatmentId?: string;
  problemId?: string;
  relatedData?: any;
  dueDate?: string;
  cattleTag?: string;
  medication?: string;
  withdrawalEndDate?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getNotificationsByUser: (userId: string, role?: string) => Notification[];
  getUnreadCount: (userId: string, role?: string) => number;
  clearNotifications: () => void;
  createWithdrawalAlert: (prescription: any, problem: any) => void;
  getActiveWithdrawalAlerts: (farmerId: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Failed to load notifications from localStorage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Accept userId and role, filter strictly by role
  const getNotificationsByUser = (userId: string, role?: string) => {
    if (role === 'farmer') {
      return notifications.filter(notification => notification.farmerId === userId);
    }
    if (role === 'veterinarian') {
      // Include notifications directly targeted to the vet, plus broadcast problem reports
      return notifications.filter(notification =>
        notification.veterinarianId === userId ||
        (notification.type === 'problem_reported' && !notification.veterinarianId)
      );
    }
    if (role === 'regulator') {
      // For regulators, surface broader compliance-related notifications by default
      return notifications.filter(notification =>
        notification.type === 'compliance_alert' ||
        notification.type === 'withdrawal_alert' ||
        notification.type === 'problem_reported'
      );
    }
    // fallback: no notifications
    return [];
  };

  const getUnreadCount = (userId: string, role?: string) => {
    return getNotificationsByUser(userId, role).filter(notification => !notification.read).length;
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createWithdrawalAlert = (prescription: any, problem: any) => {
    const withdrawalEndDate = new Date(prescription.prescribedDate);
    withdrawalEndDate.setDate(withdrawalEndDate.getDate() + prescription.withdrawalPeriod);
    
    const now = new Date();
    const daysRemaining = Math.ceil((withdrawalEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
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
    } else if (daysRemaining <= 2) {
      priority = 'high';
      title = t('notifications.withdrawalPeriodEndingSoon.title');
      message = t('notifications.withdrawalPeriodEndingSoon.message', {
        cattleTag: problem.cattleTag,
        medication: prescription.medication,
        daysRemaining,
        date: withdrawalEndDate.toLocaleDateString()
      });
    } else if (daysRemaining <= 5) {
      priority = 'medium';
      title = t('notifications.withdrawalPeriodActive.title');
      message = t('notifications.withdrawalPeriodActive.message', {
        cattleTag: problem.cattleTag,
        medication: prescription.medication,
        daysRemaining
      });
    } else {
      priority = 'low';
      title = t('notifications.withdrawalPeriodStarted.title');
      message = t('notifications.withdrawalPeriodStarted.message', {
        cattleTag: problem.cattleTag,
        medication: prescription.medication,
        daysRemaining
      });
    }
    
    const notification: Notification = {
      id: `withdrawal_${prescription.id}_${Date.now()}`,
      type: 'withdrawal_alert',
      title,
      message,
      timestamp: new Date().toISOString(),
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
    
    setNotifications(prev => [notification, ...prev]);
  };
  
  const getActiveWithdrawalAlerts = (farmerId: string) => {
    const now = new Date();
    return notifications.filter(notification => 
      notification.farmerId === farmerId &&
      notification.type === 'withdrawal_alert' &&
      notification.withdrawalEndDate &&
      new Date(notification.withdrawalEndDate) > now
    );
  };

  return (
    <NotificationContext.Provider value={{
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
    </NotificationContext.Provider>
  );
};
