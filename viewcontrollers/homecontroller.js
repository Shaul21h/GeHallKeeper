module.exports.controller = function(app){
	/*Home controller */
	var Hall = require('mongoose').model('Hall');
	app.get('/',function(req,res){
		res.render('home/index',{title: "GE Hall Keeper"});
	});
	app.get('/home',function(req,res){
		Hall.find({},function(err,halls){
			if(err)console.log(err);
			else{
				res.render('home/index',{title: "GE Hall Keeper",halls:halls});
			}
		});
	});

	app.get('/getHalls',function(req,res){
		Hall.find({},function(err,halls){
			if(err)console.log(err);
			else{
				res.send(halls);
			}
		});
	});
	
};
module.exports.socket = function(socket){
	var HallModel = require('mongoose').model('Hall');
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	var updateHallOccupancy = function(hall,callback){
		HallModel.findById(hall._id,function(err,foundHall){
			if(err)console.log("error finding particular hall : "+err);
			else{
				console.log(foundHall);
				foundHall.occupancy = hall.occupancy;
				foundHall.save(function(saveError,savedHall,numberAffected){
					if(saveError)console.log("error saving record");
					else{ 
						console.log('hall saved successfully.');
						callback(savedHall);
					}
					console.log('numberAffected is '+numberAffected);
				});
				//socket.broadcast.emit('updateHall',hall);
				
			}
		});
	};
	socket.on('shoutHallBooked',function(hall){
		updateHallOccupancy(hall,function(updatedHall){
			socket.broadcast.emit('updateHall',updatedHall);
		});
	});

	socket.on('updateHall',function(hall){
		updateHallOccupancy(hall,function(updatedHall){
			socket.broadcast.emit('updateHall',updatedHall);
		});
	});
};