const { Router } = require("express");
const {
	getAllSongs,
	createSongs,
	updateSongs,
	deleteSongs,
	getSongByCreatedby,
	// getSongByCreatedby,
} = require("../service/songService.js");
const {
	authorizationMiddleware,
} = require("../middleware/authorization-middleware.js");
const authenticationMiddleware = require("../middleware/authentication-middleware.js");
const { checkRole } = require("../middleware/checkRole.js");

const songRouter = Router();

songRouter.get(
	"/",
	authenticationMiddleware,
	checkRole(["admin"]),
	getAllSongs
);
songRouter.get(
	"/me",
	authenticationMiddleware,
	checkRole(["songwriter", "producer"]),
	getSongByCreatedby
);
songRouter.post(
	"/",
	authenticationMiddleware,
	checkRole(["songwriter", "producer"]),
	createSongs
);
songRouter.put(
	"/:id",
	authenticationMiddleware,
	checkRole(["songwriter", "producer"]),
	updateSongs
);
// songRouter.patch(
// 	"/:id",
// 	authenticationMiddleware,
// 	checkRole(["songwriter", "producer"]),
// 	updateSongsProgress
// );
songRouter.delete(
	"/:id",
	authenticationMiddleware,
	checkRole(["songwriter", "producer", "admin"]),
	deleteSongs
);

module.exports = songRouter;
