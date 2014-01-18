module.exports.controller = function(app){
	/*Hall admin controller */
	var Hall = require('mongoose').model('Hall');
	app.get('/admin/halladmin',function(req,res){
		res.render('admin/halladmin',{title: "Hall Admin"});
	});
	app.post('/admin/hallAdmin/createUpdate',function(req,res){
		var postedHall = req.body;
		if(postedHall._id==null || postedHall._id==""){
			//create a new document
			var hall = new Hall();
			hall = postedHall;
			hall.save(function(err,result){
				if(err){
					console.log(err);
				}
				else{
					console.log('added hall: '+result );
					res.send('added hall: '+result );
				}
			});
		}
		else{
			//find and modify the document
			var objectId = postedHall._id;
			delete postedHall._id;
			Hall.findByIdAndUpdate(objectId,postedHall,function(error,saved){
				if(error) console.log(error);
				else console.log(saved);
			});
		}
		
		// var hall = new Hall();
		// hall.hallId = req.params.hall.hallId;
		// hall.name = req.params.hall.name;
		// hall.alias= req.params.hall.alias;
		// hall.locationHint = req.params.hall.locationHint;
		// hall.capabilities = req.params.hall.capabilities;
		// hall.save(function(err,result){
		// 	if(err) res.send('error saving new hall: '+err);
		// 	else res.send('added hall: '+result);
		// });
		//console.log(req.body);
	})
};