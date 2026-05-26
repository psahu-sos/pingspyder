import React, { createContext, useContext, useState } from 'react';

// === CONTEXT INITIALIZATION ===
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // === STATE MANAGEMENT ===
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // === NOTIFICATION CONTROLLERS ===
  const addNotification = (deviceName, location) => {
    // Placeholder for future manual notification triggers
  };

  const syncNotifications = (visibleNodes) => {
    setNotifications(prev => {
      // Extract nodes that are visible on the current view and are offline
      const downNodes = visibleNodes.filter(node => 
        node.status === 'DOWN' || node.status === 'CRITICAL FAIL'
      );

      let newNotificationsList = [];

      downNodes.forEach(node => {
        const existingNotif = prev.find(n => n.nodeId === node.id);

        if (existingNotif) {
          // Retain existing notification to preserve the original timestamp
          newNotificationsList.push(existingNotif);
        } else {
          // Push new alert for freshly detected offline devices
          newNotificationsList.unshift({
            id: Date.now() + Math.random(),
            nodeId: node.id,
            message: `${node.tag !== 'N/A' ? node.tag : node.stretch} is OFFLINE`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'error'
          });
        }
      });

      // Update badge count strictly based on active, visible alerts
      setUnreadCount(newNotificationsList.length);
      return newNotificationsList;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // === PROVIDER ===
  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, syncNotifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// === CUSTOM HOOK ===
export const useNotifications = () => useContext(NotificationContext);