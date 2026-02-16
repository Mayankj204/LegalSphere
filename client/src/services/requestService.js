// client/src/services/requestService.js
import api from "./api";

/* ================================
   CLIENT → SEND REQUEST
================================ */
export const sendConsultationRequest = async (lawyerId, message) => {
  const res = await api.post("/requests", {
    lawyerId,
    message,
  });
  return res.data;
};

/* ================================
   LAWYER → GET ALL REQUESTS
================================ */
export const getLawyerRequests = async () => {
  const res = await api.get("/requests/lawyer");
  return res.data;
};

/* ================================
   CLIENT → GET OWN REQUESTS
================================ */
export const getClientRequests = async () => {
  const res = await api.get("/requests/client");
  return res.data;
};

/* ================================
   LAWYER → UPDATE STATUS
================================ */
export const updateRequestStatus = async (requestId, status) => {
  const res = await api.put(`/requests/${requestId}`, { status });
  return res.data;
};
