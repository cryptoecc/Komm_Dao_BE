const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 PIN 번호 생성
};

module.exports = {
  generatePin,
};
