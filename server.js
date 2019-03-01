const http = require('http');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 2999;

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/images", { useNewUrlParser: true });
const connection = mongoose.connection;
mongoose.Promise = global.Promise;

connection.on('error', () => {
    console.log("Error connecting database");
});

connection.once('open', () => {
    //Running server
    const app = require('./app');

    app.set('port', PORT);
    server = http.createServer(app);
    server.listen(app.get('port'), () => console.log("Image CDN is listening on port " + app.get('port')));
});