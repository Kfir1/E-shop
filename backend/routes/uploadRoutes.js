import path from 'path';
import express from 'express'; // for Router()
import multer from 'multer';
const router = express.Router();

// save to disk/server
// to save need to pass an object
const storage = multer.diskStorage({
    // destination describes where will be saved
    // cb is callback inside of destination
    destination(req, file, cb) {
        cb(null, 'uploads/'); // null is for error. uploads is where the data will go     
    },
    filename(req, file, cb) {
        // null for error
        // the second parameter will create the file name
        // file.fieldname can be anything - will be image
        // Date.now() to get the exact date of file creation
        // {path.extname(file.originalname)}   is whatever extension the file has. jpg, jpeg etc'
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// funtion to check the file type
// to prevent from uploading unwanted file (unwanted extensions/formats)
function checkFileType(file,cb) {
    const filetypes = /jpg|jpeg|png/; // allowed file extensions
    // test if files match the regular expression - means the allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) { // if tests passed and extensions are ok null(no error) and true(file extensions are allowed) 
        return cb(null, true);
    } else {
        cb('Images only!'); // else cb(argument1 = 'Images only!'). second argument not mentioned
    }
}

const upload = multer({
    // pass the storage variable through multer
    storage,
});

// upload.single('image')  this is the middleware in use
// single() means one file can be uploaded at a time
// there is an option to upload an array of file, but will not do it in this project
// file.fieldname - the fieldname = image - or whatever string inside single('')
// the upload is handled by the middleware, but adding response also to send back something and know its ok
router.post('/', upload.single('image'), (req, res) => { 
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path}`, // image path
    });
})

export default router;