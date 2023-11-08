const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "profile_image") {
      cb(null, "./public/profile_images");
    } else if (file.fieldname == "post_image") {
      cb(null, "./public/post_images");
    }else if (file.fieldname == "post_video") {
      cb(null, "./public/post_videos");
    }else if (file.fieldname == "post_audio") {
      cb(null, "./public/post_audios");
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
  storage,
  // fileFilter: (req, file, cb) => {
  //   const imageTypes = ["image/png", "image/jpeg", "image/gif"];
  //   if (!file) {
  //     cb(new Error("Image is required!"), false);
  //   } else if (!imageTypes.includes(file.mimetype)) {
  //     cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
  //   } else {
  //     cb(null, true);
  //   }
  // },
});

module.exports = {
  upload,
};
