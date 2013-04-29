
var gm = require('gm'),
express=require('express');

var app=express();
var dobuffer=true;

var cache={};

if(dobuffer)
  require('gm-buffer');

app.get('/:width/:height/:path?*',function(req,res,next) {

  res.setHeader("Content-Type","image/png");
  if(cache[req.path]) {
    res.setHeader("Content-Length",cache[req.path].length);
    return res.end(cache[req.path]);
  }
  var w=req.params.width*1;
  var h=req.params.height*1;
  var p=req.params.path;
  var gmres=gm(p)
  .resize(w,h)
  .autoOrient();

  if(dobuffer) {
    gmres.buffer(function(err,buffer) {
      if(!err) {
	cache[req.path]=buffer;
      }
      res.setHeader("Content-Length",buffer.length);
      res.end(buffer);
    }); 
  } else {

    gmres.stream(function (err, stdout, stderr) {
      if (err) next(err);
      stdout.pipe(res);
      stdout.on("error",next);
    });
  }
});

app.listen(8080);
