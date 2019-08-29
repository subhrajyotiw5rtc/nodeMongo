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
	//console.log('state',req.body);
	db.SubStatus.aggregate([
		{ $match : { caseState : state, caseStatus:status } },
		{ $project: {dateDifference: { $divide: [{ $subtract: [ "$lastModifiedDate", "$createdDate" ]}, 1000*60*60] }}}
	])
	.toArray((err, docs)=>{
		console.log('docs',docs);

	})
});
module.exports = router;
