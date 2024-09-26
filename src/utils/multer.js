const multer = require("multer");
const path = require("path");

// 저장할 디렉토리와 파일 이름 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url.includes("contribution")) {
      // contribution과 관련된 요청은 uploads/contribution에 저장
      cb(null, path.join(__dirname, "../../src/assets/uploads/contribution"));
    }
    if (req.url.includes("deal")) {
      cb(null, path.join(__dirname, "../../src/assets/uploads/deal"));
    } else {
      // 그 외의 요청은 기본 경로에 저장
      cb(null, path.join(__dirname, "../../src/assets/uploads"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
