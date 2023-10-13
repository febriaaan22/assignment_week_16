const checkRole = (allowedRoles) => {
	return (req, res, next) => {
		const { role } = req.user;

		if (!allowedRoles.includes(role)) {
			return res.status(403).json({
				message:
					"Access Denied, you don't have permission to access this data or url",
			});
		}
		next();
	};
};

module.exports = { checkRole };
