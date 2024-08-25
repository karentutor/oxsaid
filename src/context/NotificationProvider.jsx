/* eslint-disable react/prop-types */
import { axiosBase } from "@/services/BaseService";
import { createContext, useContext, useState, useEffect } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ userId, children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await axiosBase.get(`/notifications?userId=${userId}`);
      if (data?.isSuccess) {
        setNotifications(data.notifications);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationIds) => {
    await Promise.all(
      notificationIds.map((id) =>
        axiosBase.put(`/notifications/${id}`, { isRead: true })
      )
    );

    // Refresh notifications
    const { data } = await axiosBase.get(`/notifications?userId=${userId}`);
    if (data?.isSuccess) {
      setNotifications(data.notifications);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, markAsRead, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
