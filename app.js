const fs = require('fs')
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const formidable = require('formidable');

const db = require('./db');
app = express();

//Configuring server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.json({ success: true, message: "Welcome to Image CDN" }))

app.post('/', (req, res) => {

    let form = new formidable.IncomingForm({
        uploadDir: __dirname,
        keepExtensions: true
    });

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + "/" + file.name;
    });

    form.on('file', function (name, file){

        let image = new db.Image;
        image.img.data = fs.readFileSync(file.path);
        image.name = file.name;
        
        image.img.contentType = 'image/jpg';
        image.save().then((data) => {
            res.json({
                success: true,
                data: file.name,
                _id: data._id
            });
            return
        }).catch(err => {
            console.error(err); 
            res.sendStatus(500);
            return;
        })

    });
});

app.get('/list', async (req, res) => {
    try {
        res.json({
            success: true,
            data: await db.Image.find({}).select({ img: 0 })
        })
    } catch(e) {
        console.error(e); 
        res.sendStatus(500);
        return;
    }
})

app.get('/:image', async (req, res) => {
    try{
        await db.Image.findOne({ "name": req.params.image })
                .then(doc => {

                    if(!doc) {
                        res.json({
                            success: false,
                            message: "no image found"
                        })
                        return;
                    }

                    let buffer = new Buffer.from(doc.img.data, 'binary')
                    res.setHeader("Content-type", "image/jpeg");
                    res.send(buffer);
                })
    } catch(e) {
        console.error(e); 
        res.sendStatus(500);
        return;
    }
});


app.delete('/:image', async (req, res) => {
    try{
        await db.Image.deleteOne({ "name": req.params.image })
                .then(doc => {
                    res.json({
                        success: true
                    })
                })
    } catch(e) {
        console.error(e); 
        res.sendStatus(500);
        return;
    }
});

module.exports = app;