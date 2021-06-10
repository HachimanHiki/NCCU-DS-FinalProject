var express = require('express');
var router = express.Router();


// create a kafka client to connect kafka server 
var kafka = require('kafka-node');
client = new kafka.KafkaClient({ kafkaHost: '18.224.252.168:9092' }),

    //create  a  producer 
Producer = kafka.Producer
producer = new Producer(client),
    //create a consumer 
Consumer = kafka.Consumer;

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


    //create a object to strore in kafka

/*    
 *    
 *    ID               : string   			   //�ӫ~�W��
    add_item    : boolean  		 	//true �s�W�Ъ� false �v��
    email           : string  			             //�v�Ъ̩ηs�W�Ъ����H��email 
    price            : number   			        //�p�G�O�s�W�Ъ��N��_�л��A�v�Ъ̪��X��
    end_time    : number(unix time)    // �I�Юɶ�
    timestamp : number(unix time)    	 //�ƥ�o�ͮɶ�
    description : string   			              //���� 

*/

    var kfdata = {};
    kfdata['ID'] = object['name'];
    kfdata['add_item'] = true;
    kfdata['email'] = "example@gmail.com";
    kfdata['price'] = Number( object['beginPrice']);
    kfdata['end_time'] = Date.parse(object['time']);
    kfdata['timestamp'] = Date.now();
    kfdata['description'] = object['description'];

    //create a new topic 
    var topicsToCreate = [{

        topic: kfdata['ID'],
        partitions: 1,
        replicationFactor: 1

    }];

    client.createTopics(topicsToCreate, (error, result)=> {
        // result is an array of any errors if a given topic could not be created
 
        //save data into topic 


    /* producer.on('ready', function () {
                console.log('producer on')
                payloads = [
                    { topic: kfdata['ID'], messages: JSON.stringify(kfdata), partition: 0 }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                    client.close();
                });
     });
        producer.on('error', function (err) { console.log(err); })
        */
        console.log('create topic');

    //end save data
      
    });



    


    //.console.log(kfdata);
    //console.log(JSON.stringify(kfdata));



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
