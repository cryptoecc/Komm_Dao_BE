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
      console.log(user);
      if (!user) {
        // 지갑이 등록되어 있지 않은 경우
        return res
          .status(400)
          .send({ success: false, message: "Wallet not registered" });
      }

      if (user.dataValues.activate_yn === "Y") {
        // 활성화된 유저인 경우
        console.log(user.dataValues.activate_yn);
        return res.status(200).send({ success: true, data: user });
      } else {
        console.log("여기?");
        // 활성화되지 않은 유저인 경우
        return res
          .status(401)
          .send({ success: false, message: "Wallet is not activated" });
      }
    } else {
      return res
        .status(402)
        .send({ success: false, message: "Address verification failed" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
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
