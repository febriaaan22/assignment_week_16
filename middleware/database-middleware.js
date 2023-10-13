const { MongoClient } = require("mongodb");

const databaseMiddleware = async (req, res, next) => {
	const mongoClient = await new MongoClient(process.env.MONGO_SIGN).connect();
	db = mongoClient.db("TaylorSwift");

	req.db = db;
	console.log("success connected to mongodb");
	next();
};

module.exports = databaseMiddleware;
