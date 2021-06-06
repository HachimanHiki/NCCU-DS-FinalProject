var express = require('express');
var router = express.Router();

let datalist = [];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});

router.post('/upload', function(req, res, next) {
  let object = JSON.parse(JSON.stringify(req.body));
  let ID = datalist.length
  object['ID'] = ID
  //console.log(object);
  datalist[ID] = object;
  // console.log(datalist);
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
    GoodName:datalist[i].name,
    StartPrice:datalist[i].beginPrice,
    CurrentPrice:datalist[i].beginPrice,
    Deadline:datalist[i].time,
    GoodDescription:datalist[i].description,
	})
});
module.exports = router;
