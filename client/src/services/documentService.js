// client/src/services/documentService.js
import API from "./api";

const BASE = "/documents";

// Upload
export const uploadDocument = async (file, caseId = "") => {
  const form = new FormData();
  form.append("document", file); // THIS MUST MATCH multer.single("document")

  if (caseId) form.append("caseId", caseId);

  try {
    const res = await API.post(`${BASE}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.document;
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    throw err;
  }
};

// Get all
export const getAllDocuments = async () => {
  const res = await API.get(BASE);
  return res.data;
};

// Get one
export const getDocumentById = async (id) => {
  const res = await API.get(`${BASE}/${id}`);
  return res.data;
};

// Delete
export const deleteDocument = async (id) => {
  const res = await API.delete(`${BASE}/${id}`);
  return res.data;
};

// Download
export const downloadDocument = (id, filename = "document") => {
  const url = `http://localhost:5000/api${BASE}/download/${id}`;
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
};
