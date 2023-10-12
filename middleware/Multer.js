const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix)

    const filename=`${Date.now()}-${file.originalname.split(" ").join("-")}`;
    cb(null, filename)
  },
});

const upload = multer({ storage: storage }).single("image");

module.exports = {
  upload,
};
