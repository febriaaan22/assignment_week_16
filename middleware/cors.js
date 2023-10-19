const cors = require("cors");

const setCors = (req, callback) => {
	const allowedUrl = "http://localhost:5173";
	let corsOptions;

	if (allowedUrl.includes(req.header("Origin"))) {
		corsOptions = {
			origin: true,
			methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
			credentials: true,
			optionSuccessStatus: 200,
		};
	} else {
		corsOptions = {
			origin: false,
		};
	}
	callback(null, corsOptions);
};

const applyCors = (app) => {
	app.use(cors(setCors));
};

module.exports = { applyCors };
