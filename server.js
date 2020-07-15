var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var cv = require('opencv');
var process = require('process');

http.listen(3000, function() {
  console.log('Server is running on port 3000');
});

app.get('/stream', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(http);
var clientid=[];
var clientcamera=[];
var clientc2i=[];
var clientb64=[];

io.sockets.on('connection',function(socket){
  clientid.push(socket.id);
  var camera= new cv.VideoCapture('rtsp://admin:admin@140.113.179.14:8088/channel1');
  clientcamera.push(camera);
  clientc2i.push('');
  clientb64.push('');
  cam2img(socket.id);
  socket.emit('frame', { buffer:  clientb64[clientid.indexOf(socket.id)]});
//*
  socket.on('req', function() {
    if (clientid.indexOf(socket.id)!==-1) {
      clientc2i[clientid.indexOf(socket.id)].detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;
        for (var i = 0; i < faces.length; i++) {
          if (err) throw err;
          face = faces[i];
          clientc2i[clientid.indexOf(socket.id)].rectangle([face.x, face.y], [face.width, face.height], [0, 255, 0], 2, function(err){
            if (err) throw err;
          });
        }
        clientb64[clientid.indexOf(socket.id)]=clientc2i[clientid.indexOf(socket.id)].toBuffer(".jpg").toString("base64");
        socket.emit('frame', { buffer:  clientb64[clientid.indexOf(socket.id)]});
      });

    }
  });
//*/
  socket.on('disconnect', function(socket) {
    clientid.splice(clientid.indexOf(socket.id), 1);
    clientb64.splice(clientid.indexOf(socket.id), 1);
  });
});

function cam2img(cid) {
  if (clientid.indexOf(cid)!==-1) {
    clientcamera[clientid.indexOf(cid)].read(function(err, im) {
      if (err) throw err;
        clientc2i[clientid.indexOf(cid)]=im;
        cam2img(cid);
      });
  }
}
