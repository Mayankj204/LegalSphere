// hearingService.js
import api from "./api";

export const getHearings = async () => {
  const res = await api.get("/hearings");
  return res.data.hearings;
};

export const createHearing = async (payload) => {
  const res = await api.post("/hearings", payload);
  return res.data.hearing;
};

export default { getHearings, createHearing };
