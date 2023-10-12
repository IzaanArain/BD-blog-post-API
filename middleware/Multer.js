const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${file.originalname.split(" ").join("-")}`;
    
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).single("image");

module.exports = {
  upload,
};
