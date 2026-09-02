import api from "../api/axios";

export const getNotifications = async () => {
    const response = await api.get("/notifications/");
    return response.data;
};

export const markNotificationRead = async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/`, {
        is_read: true,
    });
    return response.data;
};
