import axios from "axios";

export const axiosInstance = axios.create({
    headers:{
        // standard way of sending authorization token to the backend
        authorization : `Bearer ${localStorage.getItem("token")}`
    }
});

