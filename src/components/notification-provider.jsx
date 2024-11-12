/* eslint-disable react/prop-types */
import { NotificationsProvider } from "@/context/NotificationProvider";
import useAuth from "@/hooks/useAuth";

export default function NotificationProvider({ children }) {
  const { auth } = useAuth();

  return (
    <NotificationsProvider userId={auth?.user?._id || ""}>
      {children}
    </NotificationsProvider>
  );
}
