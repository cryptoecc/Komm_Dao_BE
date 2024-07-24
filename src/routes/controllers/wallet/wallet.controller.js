const dotenv = require("dotenv");
// const web3 = require("../../../utils/web3");
const { verifyMessage } = require("../../../utils/web3");
const { UserInfo } = require("../../../../models/index");

exports.verify = async (req, res) => {
  const { address, message, signature } = req.body;
  console.log(address, message, signature);

  try {
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      // 데이터베이스에서 지갑 확인
      const user = await UserInfo.findOne({ where: { wallet_addr: address } });
      console.log("asd", user);
      if (user) {
        res
          .status(200)
          .send({ success: true, message: "Wallet verified successfully" });
      } else {
        console.log("없음");
        res.status(400).send({
          success: false,
          message: "Address not registered in the database",
        });
      }
    } else {
      res
        .status(400)
        .send({ success: false, message: "Address verification failed" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }

  //   res.json("hello");
};

exports.checkWallet = async (req, res) => {
  const { address, message, signature } = req.body;
  console.log(address, message, signature);

  try {
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      res
        .status(200)
        .send({ success: true, message: "Wallet verified successfully" });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Address verification failed" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
