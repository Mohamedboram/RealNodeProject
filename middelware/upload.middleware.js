import multer from "multer";
import createError from "../utlis/createError.js";
import fs from "fs";
import slugify from "slugify";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.categoryName) {
      req.body.categoryName = slugify(req.body.categoryName, { lower: true });
      console.log(req.body.categoryName);
      const categoryDir = `uploads/categories`;

      if (!fs.existsSync(categoryDir)) {
        try {
          fs.mkdirSync(categoryDir);
          cb(null, categoryDir);
        } catch (error) {
          cb(error);
        }
      } else {
        return cb(null, categoryDir);
      }
    } else {
      cb(null, "uploads");
    }
  },
  filename: function (req, file, cb) {
    if (req.body.categoryName) {
      return cb(
        null,
        req.body.categoryName + "-" + Date.now() + "-" + file.originalname
      );
    }
    cb(null, Date.now() + "-" + file.originalname);
  },
});
function fileFilter(req, file, cb) {
  let type = file.mimetype.split("/")[0];

  if (type == "image") {
    return cb(null, true);
  } else {
    return cb(createError.createError(400, "failed", "file not image"), false);
  }
}

const upload = multer({ storage, fileFilter });
export default upload;
