const mongoose = require("mongoose");

const electricladySchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Permission",
	},
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
});

const ElectricLady = mongoose.model("ElectricLady", electricladySchema);
module.exports = ElectricLady;
