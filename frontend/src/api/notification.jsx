import { api } from "./registerApi";

export const getNotificationById = (UserId) => api.get(`/notification/${UserId}`)

export const readNotificationByid =(UserId) => api.post('/notification')