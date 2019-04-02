/**
 * Error Status Code 422 mean Validation Error
 */

// Main Module Required..
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// Main Blog Router File..
const blogRoutes = require('./routes/blog');

// Main User Router File..
const userRoutes = require('./routes/user');

// Cross Unblocker File..
const crossUnblocker = require('./controller/cros-unblocker');

// Main Express App Variable..
const app = express();

// For Image Upload Type with Mime..
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// Main Image Storage Loacation and name..
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});
// File Filter with mime Type..
const fileFilter = (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (isValid) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


// BodyParser Middleware for request data extractor..
app.use(bodyParser.json());
// CROS Unblocker Middleware..
app.use(crossUnblocker.allowCross);
// Static Image Path Folder..
app.use('/images', express.static(path.join(__dirname, 'images')));
// Use Multer Middleware For Image Upload..
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));


//Router Request Handeler..
app.use('/api', blogRoutes);
app.use('/auth', userRoutes);

//Error Handelar..
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message;
    const data = error.data;
    

    res.status(status).json({
        message: message,
        data: data
    });
});

//MongoDB Connection..
mongoose.connect('mongodb+srv://ikbalsazib11:s1LbiFi0ooBoqMPz@cluster0-qbram.mongodb.net/phonefolk-blog?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log('Connected to Clusrer Cloud MongoDB');
    })
    .catch(err => {
        console.error('Can not Connect to MongoDB', err);
    })

// mongoose.connect('mongodb://localhost:27017/phonefolk-blog', { useNewUrlParser: true, useCreateIndex: true })
//     .then(() => {
//         console.log('Connected to Localhost MongoDB');
//     })
//     .catch(err => {
//         console.error('Can not Connect to MongoDB', err);
//     })

// For Main Server..
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running at port:${port}`)); 