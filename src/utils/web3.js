const { Web3 } = require("web3");
const dotenv = require("dotenv");
dotenv.config();

const INFURA_KEY = process.env.INFURA_PROJECT_ID;

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`
  )
);

const verifyMessage = (message, signature) => {
  try {
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    console.log("Recovered address:", recoveredAddress); // 디버깅을 위해 추가
    return recoveredAddress;
  } catch (error) {
    console.error("Verification error:", error); // 디버깅을 위해 추가
    throw error;
  }
};

module.exports = {
  web3,
  verifyMessage,
};
