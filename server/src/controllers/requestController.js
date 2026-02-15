import ConsultationRequest from "../models/ConsultationRequest.js";

export const createRequest = async (req, res) => {
  try {
    const { lawyerId, message } = req.body;

    const request = await ConsultationRequest.create({
      client: req.user._id,
      lawyer: lawyerId,
      message,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to send request" });
  }
};

export const getLawyerRequests = async (req, res) => {
  try {
    const requests = await ConsultationRequest.find({
      lawyer: req.user._id,
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await ConsultationRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ error: "Request not found" });

    request.status = status;

    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to update request" });
  }
};
