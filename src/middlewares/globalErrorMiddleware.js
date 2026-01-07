// module.exports = (err, req, res, next) => {
//   // Auth related error
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({ message: "Invalid credential" });
//   }

//   // Mongoose validation error
//   if (err.name === "ValidationError") {
//     return res
//       .status(400)
//       .json({ message: Object.values(err.errors)[0].message });
//   }

//   // Custom error
//   if (err.statusCode) {
//     return res.status(err.statusCode).json({ message: err.message });
//   }

//   // Default
//   res.status(500).json({ message: "Something went wrong" });
// };
