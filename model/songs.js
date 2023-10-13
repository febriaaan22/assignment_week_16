const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	songwriter: {
		type: String,
		required: true,
	},
	producer: {
		type: String,
		required: true,
	},
	mixer: {
		type: String,
		required: true,
	},
	engineer: {
		type: String,
		required: true,
	},
	studio: {
		type: String,
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "electriclady",
		required: true,
	},
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
