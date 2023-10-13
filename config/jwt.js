const dotenv = require("dotenv");
dotenv.config();

const JWT_SIGN = process.env.JWT_SIGN;
const MONGO_URI = process.env.MONGO_SIGN;

module.exports = { JWT_SIGN, MONGO_URI };
