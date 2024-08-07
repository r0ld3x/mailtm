import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

interface MessageData {
  screen: string; // Mandatory property
  [key: string]: any; // Index signature for additional properties
}

const useNotificationMessage = () => {
  const notiResponseListener = useRef<any | null>(null);
  const router = useRouter();

  function redirect(notification: Notifications.Notification) {
    const parsedObject = JSON.parse(
      JSON.stringify(notification.request.content.data)
    );
    const isValid =
      typeof parsedObject === "object" &&
      parsedObject !== null &&
      typeof parsedObject.screen === "string";
    if (!isValid) return;

    const messageData: MessageData = parsedObject;
    const queryParams = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(messageData).filter(([key]) => key !== "screen")
      ),
    }).toString();
    const url = `/${messageData.screen}${queryParams ? `?${queryParams}` : ""}`;
    return router.push(url);
  }

  useEffect(() => {
    notiResponseListener.current =
      Notifications.addNotificationResponseReceivedListener((res) => {
        if (typeof res.notification.request.content.data !== "object") return;

        redirect(res.notification);
      });

    return () =>
      Notifications.removeNotificationSubscription(
        notiResponseListener.current
      );
  }, []);
};

export default useNotificationMessage;
