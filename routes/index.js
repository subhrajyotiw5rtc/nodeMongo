var express = require('express');
var mongoJs=require('mongojs');
var router = express.Router();
var collections=['SubStatus'];
var MONGOLAB_URI="mongodb://nitank:dnh9566@ds259175.mlab.com:59175/devdoit";
var db=mongoJs(MONGOLAB_URI,collections);
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
   res.sendFile(__dirname + '/index.html');
});
router.get('/subStatus', function(req, res, next) {
	var startDate = new Date();
	db.SubStatus.find({},function(err,docs){
		if (!err) {
			if (docs) {
				var endDate   = new Date();
                var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
				var firstArr={'collection':'subStatus','count':docs.length,'diff':seconds};
				var sentData={'data':docs,'arr':firstArr,'statusCode': 200,'message': 'success.'};
				res.send(sentData);
			}
		}else{
			var sentData={'data':[],'arr':[],'statusCode': 400,'message': 'Failed.'};
			res.send(sentData);
		}
	})
});
router.post('/checkCount', function(req, res, next) {
	var status=req.body.status;
	var state=req.body.state;
	db.SubStatus.aggregate([
	  { $match : { caseState : state, caseStatus:status } },
	   { $group: {
    _id: {
      year: { $year: "$createdDate" },
      dayOfYear: { $dayOfYear: "$createdDate" },
      hour: { $hour: "$createdDate" },
      interval: {
        $subtract: [ 
          { $minute: "$createdDate" },
          { $mod: [{ $minute: "$createdDate"}, 60*6] }
        ]
      }
    },
    count: { $sum: 1 }
    }
  }
	])
	.toArray((err, docs)=>{
		if (err) {
			//console.log('err',err);
			var sentData={'data':[],'statusCode': 400,'message': 'Failed.'};
			res.send(sentData);
		}else{
			var arr=[{'str':'0-6HR','cnt':0},
			         {'str':'6-12HR','cnt':0},
			         {'str':'12-18HR','cnt':0},
			         {'str':'18-24HR','cnt':0},
			         {'str':'24-30HR','cnt':0},
			         {'str':'30-36HR','cnt':0},
			         {'str':'36-42HR','cnt':0},
			         {'str':'42-48HR','cnt':0},
			         {'str':'48 or more','cnt':0}];
			for(var i=0;i<arr.length;i++){
				if (i < 8) {
					if (docs[i] !=undefined) {
						arr[i]['cnt']=docs[i]['count'];
					}
				}else{
					var newCount=0;
					for(var j=0;j<docs.length;j++){
						if (j >=8) {
							newCount=newCount+docs[j]['count'];
						}
					}
					arr[i]['cnt']=newCount;
				}

			}
			var sentData={'data':arr,'statusCode': 200,'message': 'success.'};
			res.send(sentData);
			//console.log('docs',docs[1]);
		}

	})
});
module.exports = router;
