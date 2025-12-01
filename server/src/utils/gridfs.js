// server/src/utils/gridfs.js
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export function getGridBucket() {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: "documents" });
}

export async function uploadToGridFS(buffer, filename, mimeType) {
  return new Promise((resolve, reject) => {
    const bucket = getGridBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimeType,
    });

    uploadStream.write(buffer);
    uploadStream.end();

    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });
}

export async function downloadFromGridFS(fileId) {
  return new Promise((resolve, reject) => {
    const bucket = getGridBucket();
    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks = [];
    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
    downloadStream.on("error", reject);
  });
}

export async function deleteFromGridFS(fileId) {
  const bucket = getGridBucket();
  await bucket.delete(fileId);
}
