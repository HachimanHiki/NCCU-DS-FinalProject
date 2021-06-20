var express = require('express');
var router = express.Router();


// create a kafka client to connect kafka server 
var kafka = require('kafka-node');
let client = new kafka.KafkaClient({ kafkaHost: '3.137.154.62:9092' });

//create  a  producer 
Producer = kafka.Producer;
producer = new Producer(client);
//create a consumer 
Consumer = kafka.Consumer;

var offset = new kafka.Offset(client);

const admin = new kafka.Admin(client);

let datalist = [];
let enddata = [];




router.post('/uploadItem', function(req, res, next) {
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
    kfdata['email'] = object['email'];
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
        producer.send(payloads, function(err, data) {
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

    res.send('<a href="/display">商品列表</a>');
});


router.post('/updateItemPrice', function(req, res, next) {
    let name = datalist[req.body.ID].name;

    offset.fetch([
        { topic: name, partition: 0, time: -1 }
    ], function(error, data) {
        console.log(error);
        console.log(data);
        let latestOffset = data[name]['0'][0] - 1;
        console.log(latestOffset);

        consumer = new Consumer(
            client, [{ topic: name, partition: 0 }], {
                autoCommit: false,
                fromOffset: true
            }
        );
        consumer.setOffset(name, 0, latestOffset);

        let kfdata = {};

        consumer.on('message', function(message) {
            let data = JSON.parse(message.value);
            kfdata['ID'] = message.topic;
            kfdata['email'] = req.body.email;
            kfdata['startPrice'] = data.startPrice;
            kfdata['currentPrice'] = data.currentPrice;
            kfdata['endTime'] = data.endTime;
            kfdata['description'] = data.description;;

            let today = new Date();
            let deadlineDate = new Date(data.endTime);

            if (today >= deadlineDate) {
                res.send({
                    error: '已經過了競標時間'
                })
            } else if (Number(data.currentPrice) >= req.body.price) {
                res.send({
                    error: '您的出價金額比現價金額低，請再輸入一次'
                })
            } else if (datalist[req.body.ID].email == req.body.email) {
                res.send({
                    error: '您是此競標物持有者，無法競標'
                })
            } else {
                kfdata['currentPrice'] = Number(req.body.price);
                kfdata['email'] = req.body.email;

                payloads = [
                    { topic: kfdata['ID'], messages: JSON.stringify(kfdata), partition: 0 }
                ];

                // producer publish message to topics
                producer.send(payloads, function(err, data) {
                    console.log('here');
                    console.log(data);
                });

                consumer.removeTopics([name], function(err, removed) {})


                res.send({
                    itemInfo: kfdata
                })
            }
        });
    });
});

router.get('/display', function(req, res) {
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

router.get('/history', function(req, res) {
    console.log(datalist[req.body.ID].name)

    consumer = new Consumer(
        client, [{ topic: datalist[req.body.ID].name, partition: 0 }], {
            autoCommit: false
        }
    );

    var kfdata = [];

    consumer.on('message', function(message) {
        let data = JSON.parse(message.value);

        let tmpObject = {};
        tmpObject['currentPrice'] = data.currentPrice;
        tmpObject['endTime'] = data.endTime;

        kfdata.push(tmpObject);
    })

    consumer.removeTopics([name], function(err, removed) {})


    res.send(
        kfdata
    )
})

router.get('/changeItem', async function(req, res, next) {
    var name = datalist[req.query.ID].name;

    var latestOffset;
    offset.fetch([
        { topic: name, partition: 0, time: Date().now }
    ], function(error, data) {
        latestOffset = data[name]['0'][0] - 1;

        consumer = new Consumer(
            client, [{ topic: name, partition: 0, offset: 0 }], {
                autoCommit: false,
                fromOffset: true
            }
        );
        consumer.setOffset(name, 0, latestOffset);

        consumer.on('message', function(message) {
            console.log(message);
            let data = JSON.parse(message.value);
            console.log(data);
            consumer.removeTopics([name], function(err, removed) {});
            res.send({
                GoodName: message.topic,
                StartPrice: data.startPrice,
                CurrentPrice: data.currentPrice,
                Deadline: data.endTime,
                GoodDescription: data.description,
            });
        })
    });

    // res.send({
    //     GoodName: datalist[i].name,
    //     StartPrice: datalist[i].beginPrice,
    //     CurrentPrice: datalist[i].beginPrice,
    //     Deadline: datalist[i].time,
    //     GoodDescription: datalist[i].description,
    // })
});

router.get('/endbidding', async function(req, res, next) {
    // console.log(req.query.name);
    exec('sudo ~/kafka_2.13-2.8.0/bin/kafka-topics.sh --delete --topic ' + req.query.name + ' --zookeeper localhost:2181', function(err, stdout, stderr) {
        console.log(stdout);
    });
    res.send('move datalist into enddata');
});

module.exports = router;