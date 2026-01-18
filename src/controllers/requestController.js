const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// SEND REQUEST
exports.sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status "${status}"` });
    }

    if (fromUserId.toString() === toUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself" });
    }

    const toUser = await User.findById(toUserId).select("_id");
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    return res.status(201).json({
      message: "Request sent",
      data: connectionRequest,
    });
  } catch (err) {
    console.error("sendRequest error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

// REVIEW REQUEST
exports.reviewRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status "${status}"` });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested", // must be a pending request
    });

    if (!connectionRequest) {
      return res
        .status(404)
        .json({ message: "Connection request not found or already processed" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    return res.status(200).json({
      // message: `Request ${status}`,
      data: connectionRequest,
    });
  } catch (err) {
    // console.error("reviewRequest error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
