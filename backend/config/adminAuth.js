const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
	try {
			const token = req.headers['authorization'].split(' ')[1];
		if (!token) {
			return res.status(400).json({ msg: "Invalid Authentication admin" });
		}
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
              return res.status(400).json({ msg: "Invalid authentication second" });
			}
			req.user = user;
			next();
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = adminAuth;