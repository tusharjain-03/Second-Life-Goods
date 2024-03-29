import {axiosInstance} from "./axiosInstance";

// add a notification
export const AddNotification = async (data) => {
   try {
     const response = await axiosInstance.post("/api/notifications/notify", data);
     return response.data;
   } catch (error) {
     return error.message;
   }
};

// get all notifications by user
export const GetAllNotifications = async () => {
    try {
        axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axiosInstance.get("/api/notifications/get-all-notifications");
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// delete a notification
export const DeleteNotification = async (id) => {
   try {
     axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
     const response = await axiosInstance.delete(`/api/notifications/delete-notification/${id}`);
     return response.data;
   } catch (error) {
     return error.message;
   }
};

// read all notifications
export const ReadAllNotifications = async () => {
   try {
     axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
     const response = await axiosInstance.put("/api/notifications/read-all-notifications");
     return response.data;
   } catch (error) {
     return error.message;
   }
};