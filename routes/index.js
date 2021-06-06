var express = require('express');
var router = express.Router();

let data = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});

router.post('/upload', function(req, res, next) {
  let object = JSON.parse(JSON.stringify(req.body));
  //console.log(object);
  data[req.body.name] = object;
  //console.log(data);
  //console.log(data[req.body.name]);
  res.send('thanks');
});

router.get('/present', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
