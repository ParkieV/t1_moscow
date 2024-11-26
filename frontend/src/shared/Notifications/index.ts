import {useNotifications} from "./useNotifications.ts";

export const notify = (message: string) => {
  return useNotifications.getState().notify(message);
}

export {Notifications} from "./Notifications.tsx";