// services/hearingService.js
import axios from "axios";

const API = "http://localhost:5000/api/hearings";

const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const getHearings = async () => {
  const res = await axios.get(API, config);
  return res.data;
};

const createHearing = async (data) => {
  const res = await axios.post(API, data, config);
  return res.data;
};

const updateHearing = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, config);
  return res.data;
};

const deleteHearing = async (id) => {
  const res = await axios.delete(`${API}/${id}`, config);
  return res.data;
};

export default {
  getHearings,
  createHearing,
  updateHearing,
  deleteHearing,
};
