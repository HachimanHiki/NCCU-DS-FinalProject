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

router.get('/display',function(req, res) {
  var i = 0
  res.render('display',{
    datalist:datalist,
    // GoodName:data[i].GoodName,
    // StartPrice:data[i].StartPrice,
    // CurrentPrice:data[i].CurrentPrice,
    // Deadline:data[i].Deadline,
    // GoodDescription:data[i].GoodDescription,
  });
})

router.get('/changeitem', async function (req, res, next) {
  var i = req.query.ID
	res.send({
    GoodName:datalist[i].GoodName,
    StartPrice:datalist[i].StartPrice,
    CurrentPrice:datalist[i].CurrentPrice,
    Deadline:datalist[i].Deadline,
    GoodDescription:datalist[i].GoodDescription,
	})
});
module.exports = router;
