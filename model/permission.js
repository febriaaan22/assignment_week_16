const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
	role: {
		type: String,
		enum: ["producer", "songwriter", "admin"],
	},
});

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
