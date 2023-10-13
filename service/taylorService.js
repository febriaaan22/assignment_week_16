const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/jwt.js");
const ElectricLady = require("../model/electriclady.js");
const Permission = require("../model/permission.js");
const { generateResetToken } = require("../middleware/uid.js");
const { getResetPaswEmailContent } = require("../config/emailTemplate.js");
const { sendEmail } = require("../middleware/emailservice.js");
console.log(JWT_SIGN, "login page");

const validRoles = ["songwriter", "producer", "admin"];

const register = async (req, res) => {
	const { username, password } = req.body;
	try {
		const usernameValue = username.trim("");
		if (password.length < 13) {
			return false;
		}
		const alphanumericRegex = /[0-9a-zA-Z]/;
		if (!alphanumericRegex.test(password)) {
			return false;
		}
		if (usernameValue === " " || usernameValue === null) {
			res.status(200).json({
				message: "Username cant be blank",
			});
		}
		const defaultRole = await Permission.findOne({ role: "songwriter" });
		if (!defaultRole) {
			return res.status(404).json({ message: "Role not Found" });
		}
		const taylor = await ElectricLady.findOne({ username: usernameValue });
		if (taylor) {
			throw new Error("Username already exist");
		}
		const hashedPassword = await bcrypt.hash(password, 13);
		const newTaylor = new ElectricLady({
			username: usernameValue,
			password: hashedPassword,
			role: defaultRole,
		});
		await newTaylor.save();
		res.status(200).json({
			message: "User successfully registered",
			data: newTaylor,
		});
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await ElectricLady.findOne({ username }).populate("role");
		console.log(user); // For Debugging Purpose
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (user) {
			if (isPasswordCorrect) {
				const accessToken = jwt.sign(
					{ username: user.username, id: user._id, role: user.role.role },
					JWT_SIGN,
					{ expiresIn: "1hr" }
				);
				const refreshToken = jwt.sign(
					{ username: user.username, id: user._id, role: user.role.role },
					JWT_SIGN,
					{ expiresIn: "7d" }
				);
				console.log(accessToken); //For Debugging Purpose
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					secure: false,
					maxAge: 1 * 60 * 60 * 1000,
				});
				console.log(refreshToken); //For debugging purpose
				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: false,
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});
				res.json("Success Login");
			} else {
				res.status(401).json({ error: "Password is incorrect" });
			}
		} else {
			res.status(401).json({ error: "User not found" });
		}
	} catch (error) {
		console.error("Internal server error:", error);
		return res.status(500).json({ message: "Internal Server error" });
	}
};

const requestResetPassword = async (req, res) => {
	const { username } = req.body;

	try {
		const user = await ElectricLady.findOne({ username: username });
		console.log(user);
		if (!user) {
			return res.status(404).json({ message: "No Username Found" });
		}
		const token = generateResetToken();
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000;

		await user.save();

		const emailContent = getResetPaswEmailContent(token);

		await sendEmail({
			to: "test@email.com",
			subject: "Reset Password",
			html: emailContent,
		});

		res.status(200).json({ message: "Password reset link sent to email" });
	} catch (error) {
		console.error("Internal server error:", error);
		return res.status(500).json({ messsage: "Internal Server error" });
	}
};

const resetPassword = async (req, res) => {
	const { token, newPassword } = req.body;

	try {
		const user = await ElectricLady.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid or expired reset token" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 13);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		res.status(200).json({ message: "Password successfully reset" });
	} catch (error) {
		console.error("Internal server error", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const logout = async (req, res) => {
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");
	res.json();
};

module.exports = {
	register,
	login,
	logout,
	requestResetPassword,
	resetPassword,
};
