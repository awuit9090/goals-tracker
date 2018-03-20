var express = require('express'),
	app = express(),
	port = Number(process.env.PORT || 3000);

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
	
var Datastore = require('nedb');
var db = new Datastore({
	filename: 'goals.db',
	autoload: true,
	timestampData: true
});

app.get('/goals', function(req, res){
	db.find({}).sort({
		updateAt: -1
	}).exec(function(err, goals){
		if (err) res.send(err);
		res.json(goals);
	});
});

app.post('/goals', function(req, res){
	var goal = {
		description: req.body.description,
	};
	db.insert(goal, function(err, goal){
 		if (err) res.send(err);
			res.json(goal);
	});
});

app.get('/goals/:id', function(req, res){
	var goal_id = req.params.id;
	db.findOne({
		_id: goal_id
	}, {}, function(err, goal){
		if (err) res.send(err);
			res.json(goal);
	});
});

app.delete('/goals/:id', function(req, res){
	var goal_id = req.params.id;
	db.remove({
		_id: goal_id
	}, {}, function(err, goal){
		if (err) res.send(err);
			res.sendStatus(200);
	});
});


//var goal = {
//	description: 'Do 10 minutes meditation every day',
//};

//db.insert(goal, function(err, newGoal){
//	if (err) console.log(err);
//		console.log(newGoal);
//});

//app.get('/', function(req, res){
//        res.send('Our first route is working.:)');
//});

app.listen(port, function() {
	console.log('Listening on port ' + port);
});
