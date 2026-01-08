const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

// Get user feed (users not connected)
exports.getFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all connection requests involving logged in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Create set of user IDs to hide from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Find users not in hideUsersFromFeed
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("name")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
  }
};

// Get all the connections for the loggedIn user
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
