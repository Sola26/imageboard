const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const s3Url = require('./config.json');


app.use(bodyParser.json());

app.use(express.static('./public'));


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});



const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/////////////////////////



app.get("/", (req, res) => {
    res.sendFile("index.html");

});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    const imgUrl = s3Url.s3Url + req.file.filename
    console.log(req.file.filename);
    db.uploadImages(imgUrl, req.body.username, req.body.title, req.body.desc)
    .then(results => {
        // console.log('yalla', results);
        res.json(results.rows);
    })
    .catch(err => {console.log(err)});
});

app.get('/modal/:id', (req, res) => {
    db.imageAppear(req.params.id).then(result => {
        console.log('result of get modal/:id', result);
        res.json(result.rows[0])
    }).catch(err => {
        console.log('err: ', err);
    })
})

app.get("/api-request", (req, res) => {
    db.getImages().then((images) => {
        // console.log("images",images);
        res.json(images);

}).catch(err => {console.log(err)});

});

app.listen(8080, () => console.log(`I'm listening.`))
