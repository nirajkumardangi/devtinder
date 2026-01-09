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
    // Pagination parameters
    const loggedInUserId = req.user._id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Filters (optional)
    const { minAge, maxAge, gender, skills } = req.query;

    // Find all connection requests
    const related = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    // Create Set of users to hide
    const exclude = new Set([loggedInUserId.toString()]);
    related.forEach((req) => {
      exclude.add(req.fromUserId.toString());
      exclude.add(req.toUserId.toString());
    });

    // Build query wit filter
    const query = {
      _id: { $nin: [...exclude] },
    };

    // Add age filter
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }

    // Add gender filter
    if (gender) {
      query.gender = gender;
    }

    // Add skill filter
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.toLowerCase());
      query.skills = { $in: skillsArray };
    }

    // Get total count for pagination info
    const totalUsers = await User.countDocuments(query);

    // Get paginated users not in hidden set
    const users = await User.find(query)
      .select("name gender age skills headline avatar location")
      .sort({ createdAt: -1 }) // Newest users first
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      data: users,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
        totalUsers: totalUsers,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      filters: {
        minAge,
        maxAge,
        gender,
        skills,
      },
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

    // Step 1: Find accepted connections in both directions
    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate("fromUserId", USER_PREVIEW_FIELDS)
      .populate("toUserId", USER_PREVIEW_FIELDS);

    // Step 2: Extract the connected user (not self)
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId; // Return the other person
      }
      return row.fromUserId; // Return the other person
    });

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
