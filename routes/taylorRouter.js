const { Router } = require("express");
const {
	register,
	login,
	logout,
	requestResetPassword,
	resetPassword,
} = require("../service/taylorService.js");
const LoginLimiter = require("../middleware/rateLimit.js");

const taylorRouter = Router();

taylorRouter.post("/register", register);
taylorRouter.post("/login", LoginLimiter, login);
taylorRouter.post("/logout", logout);
taylorRouter.post("/requestresetpassword", requestResetPassword);
taylorRouter.post("/resetpassword", resetPassword);

module.exports = taylorRouter;
