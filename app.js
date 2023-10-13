require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const databaseMiddleware = require("./middleware/database-middleware.js");
const songRouter = require("./routes/songRouter.js");
const taylorRouter = require("./routes/taylorRouter.js");
const authMiddleware = require("./middleware/authentication-middleware.js");

const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
// const openApiValidator = require('express-openapi-validator')
const bodyParser = require("body-parser");
const dbConnection = require("./config/dbconfig.js");

const app = express();
dbConnection();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(
		yaml.parse(require("fs").readFileSync("./swagger/API.yaml", "utf8"))
	)
);
// app.use(openApiValidator.middleware({
//     apiSpec: './swagger/API.yaml'
// }));
app.use(databaseMiddleware);

app.get("/", (req, res) => {
	res.send("Milestone Week 11");
});

app.use("/taylor", taylorRouter);
app.use("/song", authMiddleware, songRouter);

app.listen(1989, () => console.log("Server is running on port 1989"));
