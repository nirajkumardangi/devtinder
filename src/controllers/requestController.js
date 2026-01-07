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
