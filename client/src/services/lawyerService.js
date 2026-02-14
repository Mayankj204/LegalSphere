// src/services/lawyerService.js
import API from "./api";

export const getAllLawyers = async (search = "") => {
  const res = await API.get(`/lawyers?search=${search}`);
  return res.data;
};


export const getLawyerById = async (id) => {
  const res = await API.get(`/lawyers/${id}`);
  return res.data;
};

export const updateLawyerProfile = async (data) => {
  const res = await API.put("/lawyers/update", data);
  return res.data;
};
