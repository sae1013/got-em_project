const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const upload = multer(
  {
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET,
      acl: "public-read-write",
      key: function (req, file, cb) {
        // 파일이름 : "현재시간.파일의확장자명"
        cb(null, Date.now() + "." + file.originalname.split(".").pop());
      },
    }),
  },
  
);

module.exports = upload;
