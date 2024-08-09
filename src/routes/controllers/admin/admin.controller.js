require("dotenv").config();
const { generateToken } = require("../../../utils/utils");
const { AdminUser } = require("../../../../models/index");
const bcrypt = require("bcrypt");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ where: { email } });
    console.log(admin.password);
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: admin.admin_id });

    res.json({ token });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
