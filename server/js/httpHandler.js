const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {
    // if (req.url === '/') { }
      res.writeHead(200, headers);
      //dequeue everything inside the msgQueue
      let direction = messageQueue.dequeue();
      if (direction) {
        res.end(direction);
      } else {
        res.end();
      } next();

    if (req.url === '/background.jpg') {
      res.writeHead(200, headers);
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404);
        } else {
          res.writeHead(200, {
            'Content-Type' : 'image/jpeg',
            'Content-Length' : 'data.length'
          });
          res.write(data, 'binary');
        }
        res.end();
        next();
      });
    };
  }
 // invoke next() at the end of a request to help with testing!
};
