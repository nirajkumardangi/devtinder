require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
