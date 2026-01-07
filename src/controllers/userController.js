const ConnectionRequest = require("../models/ConnectionRequest");

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
