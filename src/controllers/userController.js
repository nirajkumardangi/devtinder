const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const USER_PREVIEW_FIELDS = "name avatar headline skills";

/**
 * GET FEED = Users the logged-in user can swipe on
 * Rules:
 * - Hide users already connected (accepted/rejected/ignored/pending)
 * - Hide self
 * - Paginated
 */
exports.getFeed = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Find all related requests to exclude from the feed
    const related = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const exclude = new Set([loggedInUserId.toString()]);
    related.forEach((req) => {
      exclude.add(req.fromUserId.toString());
      exclude.add(req.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: [...exclude] },
    })
      .select("name gender age skills headline avatar location")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Feed fetched",
      pagination: { page, limit },
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("getFeed error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET CONNECTIONS = Only "accepted" users (mutual)
 */
exports.getConnections = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate("fromUserId", USER_PREVIEW_FIELDS)
      .populate("toUserId", USER_PREVIEW_FIELDS);

    const formatted = connections.map(({ fromUserId, toUserId }) =>
      fromUserId._id.equals(loggedInUserId) ? toUserId : fromUserId
    );

    return res.status(200).json({
      message: "Connections fetched",
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    console.error("getConnections error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET PENDING REQUESTS = "interested" requests for logged-in user
 */
exports.getConnectionRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const pending = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_PREVIEW_FIELDS);

    return res.status(200).json({
      message: "Pending requests fetched",
      count: pending.length,
      data: pending,
    });
  } catch (err) {
    console.error("getConnectionRequests error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
