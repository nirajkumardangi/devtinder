const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

exports.sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // Validate status
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type: ${status}`,
      });
    }

    // Check if toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }

    // Create a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    res.send({
      message: "Connection request sent successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { status, requestId } = req.params;

    // Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    console.log(connectionRequest);

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update status
    connectionRequest.status = status;
    await connectionRequest.save();

    res.status(200).json({
      message: "Connection request " + status,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
