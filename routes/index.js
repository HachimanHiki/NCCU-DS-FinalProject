var express = require('express');
var router = express.Router();


// create a kafka client to connect kafka server 
var kafka = require('kafka-node');
let client = new kafka.KafkaClient({ kafkaHost: '18.224.252.168:9092' }),

  //create  a  producer 
  Producer = kafka.Producer
producer = new Producer(client),
  //create a consumer 
  Consumer = kafka.Consumer;

const admin = new kafka.Admin(client);

let datalist = [];
let enddata = [];
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('upload', { title: 'Express' });
});



router.post('/upload', function (req, res, next) {
  let object = JSON.parse(JSON.stringify(req.body));
  let ID = datalist.length
  object['ID'] = ID
  //console.log(object);
  // datalist[ID] = object;


  //create a object to strore in kafka

  /*    
   *    
   *    ID               : string   			   //商品名稱
      add_item    : boolean  		 	//true 新增標物 false 競標
      email           : string  			             //競標者或新增標物的人的email
      price            : number   			        //如果是新增標物代表起標價，競標者的出價
      end_time    : number(unix time)    // 截標時間
      timestamp : number(unix time)    	 //事件發生時間
      description : string   			              //說明 
  
  */

  var kfdata = {};
  kfdata['ID'] = object['name'];
  kfdata['email'] = "example@gmail.com";
  kfdata['startPrice'] = Number(object['beginPrice']);
  kfdata['currentPrice'] = Number(object['beginPrice']);
  kfdata['endTime'] = object['time'];
  kfdata['description'] = object['description'];

  //create a new topic 
  var topicsToCreate = [{

    topic: kfdata['ID'],
    partitions: 1,
    replicationFactor: 1

  }];

  client.createTopics(topicsToCreate, (error, result) => {

    // result is an array of any errors if a given topic could not be created

    //save data into topic 
    payloads = [
      { topic: kfdata['ID'], messages: JSON.stringify(kfdata), partition: 0 }
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);

    });

    // producer.on('error', function (err) { console.log(err); })

    //console.log(kfdata);

    //end save data

  });






  //.console.log(kfdata);
  //console.log(JSON.stringify(kfdata));



  // console.log(datalist);
  //console.log(data[req.body.name]);




  res.send('thanks');
});

router.get('/present', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/display', function (req, res) {
  admin.listTopics((err, res1) => {
    var obj = res1[1].metadata;
    var keys = Object.keys(obj)
    datalist = [];
    for (i = 0; i < keys.length; i++) {
      datalist[i] = {}
      datalist[i].name = keys[i];
      datalist[i].ID = i;
    }
    console.log(datalist)
    res.render('display', {
      datalist: datalist,
      enddata: enddata,
    });
  });
})

router.get('/changeitem', async function (req, res, next) {
  var name = datalist[req.query.ID].name;
  consumer = new Consumer(
    client,
    [{ topic: name, partition: 0 }],
    {
      autoCommit: false
    }
  );

  consumer.on('message', function (message) {
    console.log(message);
    let data = JSON.parse(message.value);
    console.log(data);
    res.send({
      GoodName: message.topic,
      StartPrice: data.startPrice,
      CurrentPrice: data.currentPrice,
      Deadline: data.endTime,
      GoodDescription: data.description,
    })
  });

  // res.send({
  //   GoodName: datalist[i].name,
  //   StartPrice: datalist[i].beginPrice,
  //   CurrentPrice: datalist[i].beginPrice,
  //   Deadline: datalist[i].time,
  //   GoodDescription: datalist[i].description,
  // })
});

router.get('/endbidding', async function (req, res, next) {
  // console.log(req.query.name);
  exec('sudo ~/kafka_2.13-2.8.0/bin/kafka-topics.sh --delete --topic ' + req.query.name + ' --zookeeper localhost:2181', function (err, stdout, stderr) {
    console.log(stdout);
  });
  res.send('move datalist into enddata');
});

module.exports = router;
