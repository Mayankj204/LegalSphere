// taskService.js
import api from "./api";

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data.tasks || [];
};

export const createTask = async (payload) => {
  const res = await api.post("/tasks", payload);
  return res.data.task;
};

export const updateTask = async (id, payload) => {
  const res = await api.put(`/tasks/${id}`, payload);
  return res.data.task;
};

export default { getTasks, createTask, updateTask };
