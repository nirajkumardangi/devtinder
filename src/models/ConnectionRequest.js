const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function (next) {
  // Check if the fromUserId is same as toUserId
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequest);
