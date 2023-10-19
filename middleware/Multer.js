const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "profile_image") {
      cb(null, "./public/profile_images");
    } else if (file.fieldname == "post_image") {
      cb(null, "./public/post_images");
    }
  },
  filename: function (req, file, cb) {
    const filename = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${file.originalname.split(" ").join("-")}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage
});

module.exports = {
  upload,
};
