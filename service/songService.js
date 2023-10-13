const { ObjectId } = require("mongodb");
const Song = require("../model/songs");

const getAllSongs = async (req, res) => {
	try {
		const songs = await Song.find();

		res.status(200).json({
			message: "Song is done and produced",
			data: songs,
		});
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

const createSongs = async (req, res) => {
	const { title, songwriter, producer, studio, mixer, engineer } = req.body;

	const owner = req.user.id;
	console.log(owner);
	try {
		const newSong = new Song({
			title,
			songwriter,
			producer,
			mixer,
			engineer,
			studio,
			createdBy: owner,
			status: "on process",
		});
		await newSong.save();
		res.status(200).json({
			message: "Song is done and produced",
			data: newSong,
		});
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

const updateSongs = async (req, res) => {
	try {
		const id = req.params.id;
		const { title, songwriter, producer, mixer, studio } = req.body;

		const song = await Song.findById(id);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		const updatedSong = await Song.findOneAndUpdate(
			{ _id: id },
			{ title, songwriter, producer, mixer, studio },
			{ new: true }
		);

		res.status(200).json({
			message: "Song updated successfully",
			data: updatedSong,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error updating the song" });
	}
};

// const updateSongsProgress = async (req, res) => {
// 	const id = req.params.id;
// 	const { status } = req.body;

// 	const newStatus = await Song.findOneAndUpdate({ status });

// 	res.status(200).json({
// 		message: "Updated",
// 		data: newStatus,
// 	});
// };

const deleteSongs = async (req, res) => {
	const { id } = req.params;

	try {
		const songRemove = await Song.deleteOne({ _id: id });

		if (songRemove.deletedCount === 0) {
			return res.status(404).json({ message: "Song not found" });
		}

		res.status(200).json({
			message: "Song deleted successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error deleting the song" });
	}
};

const getSongByCreatedby = async (req, res) => {
	const id = req.user.id;

	try {
		const songs = await Song.find({ createdBy: id });
		return res
			.status(200)
			.json({ message: "Song is created based on Role", songs });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	getAllSongs,
	createSongs,
	updateSongs,
	deleteSongs,
	getSongByCreatedby,
};
