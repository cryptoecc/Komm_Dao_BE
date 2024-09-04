require("dotenv").config();
const { Contracts } = require("../../../../../models/index");
const { MESSAGES } = require("../../../../utils/messages");

exports.contractList = async (_, res) => {
  try {
    const contractList = await Contracts.findAll();
    res.json(contractList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

exports.queryContract = async (req, res) => {
  try {
    let { name } = req.params;
    if (!name) {
      res.status(500).json({ message: MESSAGES.PARAM_NOT_FOUND });
      return;
    }
    const contract = await Contracts.findOne({ raw: true, where: { name } });
    res.json(contract);
  } catch (err) {
    console.log(err);
  }
};
