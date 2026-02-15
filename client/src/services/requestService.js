import axios from "axios";

const API = "http://localhost:5000/api/requests";

// Helper to get auth headers
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ================================
   📌 CLIENT → SEND REQUEST
================================ */
export const sendConsultationRequest = async (lawyerId, message) => {
  try {
    const res = await axios.post(
      API,
      { lawyerId, message },
      getAuthConfig()
    );
    return res.data;
  } catch (err) {
    console.error("Send request error:", err);
    throw err;
  }
};

/* ================================
   📌 LAWYER → GET ALL REQUESTS
================================ */
export const getLawyerRequests = async () => {
  try {
    const res = await axios.get(
      `${API}/lawyer`,
      getAuthConfig()
    );
    return res.data;
  } catch (err) {
    console.error("Get requests error:", err);
    throw err;
  }
};

/* ================================
   📌 LAWYER → UPDATE REQUEST STATUS
   status: "Approved" | "Rejected"
================================ */
export const updateRequestStatus = async (requestId, status) => {
  try {
    const res = await axios.put(
      `${API}/${requestId}`,
      { status },
      getAuthConfig()
    );
    return res.data;
  } catch (err) {
    console.error("Update request error:", err);
    throw err;
  }
};
