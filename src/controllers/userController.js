const ConnectionRequest = require("../models/ConnectionRequest");

exports.getConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).populate("fromUserId", "name");

    const data = connectionRequests.map((row) => row.fromUserId);

    res.status(200).json({
      message: "All connection fetch successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

// Get all the pending connection request for the loggedIn user
exports.getConnectionRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "name");

    res.send({
      message: "Pending requests fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
