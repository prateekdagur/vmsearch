const mongoose = require('mongoose');
const User = mongoose.model('User');

const adminrole = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.user.id });
		if (user.user_type === "HOTEL_OWNER") {
			return res.status(400).json({ msg: "Admin access denied" });
		} 
		next();
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = adminrole;