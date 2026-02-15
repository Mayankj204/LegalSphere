import ConsultationRequest from "../models/ConsultationRequest.js";
import Notification from "../models/Notification.js";

/* ================= CREATE REQUEST ================= */
export const createRequest = async (req, res) => {
  try {
    const { lawyerId, message } = req.body;

    if (!lawyerId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await ConsultationRequest.create({
      client: req.user._id,
      lawyer: lawyerId,
      message,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ error: "Failed to send request" });
  }
};

/* ================= GET LAWYER REQUESTS ================= */
export const getLawyerRequests = async (req, res) => {
  try {
    const requests = await ConsultationRequest.find({
      lawyer: req.user._id,
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Fetch requests error:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

/* ================= UPDATE REQUEST STATUS ================= */
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await ConsultationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Only assigned lawyer can update
    if (request.lawyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    request.status = status;
    await request.save();

    /* ================= CREATE CLIENT NOTIFICATION ================= */
    await Notification.create({
      recipient: request.client,
      recipientModel: "User",
      message:
        status === "Approved"
          ? "Your consultation request has been approved by the lawyer."
          : "Your consultation request has been rejected by the lawyer.",
      type: "request_update",
    });

    res.json(request);

  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
};
