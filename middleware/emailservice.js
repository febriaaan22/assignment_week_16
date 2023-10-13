const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "kody85@ethereal.email",
		pass: "VEjAQgUb4MSuB66R5p",
	},
});

const sendEmail = async (options) => {
	const mailOptions = {
		from: "kody85@ethereal.email",
		to: options.to,
		subject: options.subject,
		html: options.html,
	};

	return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
