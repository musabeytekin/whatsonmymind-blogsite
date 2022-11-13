const multer = require("multer");
const path = require("path");
const CustomError = require("../errors/CustomError");
// storage, file filter

// storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootDir = path.dirname(require.main.filename)
        cb(null, path.join(rootDir, "/public/uploads"));

    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        req.savedImage = "image_profile_" + req.user.id + "." + extension;
        cb(null, req.savedImage);
    }
})


// filefilter
const fileFilter = (req, file, cb) => {

    const allowedTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) return cb(new CustomError("please provide a valid image type - Allowed types: jpg, gif, jpeg, png"), false)

    // To accept the file pass `true`
    return cb(null, true)

}

const photoUpload = multer({storage, fileFilter});

module.exports = photoUpload;
