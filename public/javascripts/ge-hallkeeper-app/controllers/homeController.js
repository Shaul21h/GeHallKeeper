app.controller("homeController",function($scope,$http){
	var socket = io.connect("http://" + location.host,{
		'reconnect': true,
		'reconnection delay': 500,
		'max reconnection attempts': 10
	});
	$scope.selectedHall = null;
	$scope.originalSelectedHall = null;
	$scope.halls = [];
	$scope.isSocketConnected = socket.socket.connected;
	$scope.init = function(){
		$http.get('/getHalls').
		success(function(data){
			$scope.halls = data;
			
		}).
		error(function(data){
			console.log('error in fetching halls');
		});
	};
	socket.on('connected',function(){
		alert('connected socket');
	});

	$scope.tempClick = function(data){
		socket.emit('message',"hi");
		alert('sent "hi"');
	};
	socket.on('message',function(data){
		alert(data);
	});
	socket.on('disconnect',function(){alert('disconnected');});

	$scope.setSelectedHall = function(hall){
		$scope.originalSelectedHall = hall;
		$scope.selectedHall = angular.copy(hall);
	};
	$scope.connectionStatusText = function(){
		if($scope.isSocketConnected==true)
			return "Connected for updates"
		else
			return "Connection not established"
	}
	$scope.bookHall = function(){
		if($scope.selectedHall.occupancy.occupied==false)
			$scope.selectedHall.occupancy.occupied = true;
		socket.emit('shoutHallBooked',$scope.selectedHall);
		for(var i=0;i< $scope.halls.length;i++){
			if($scope.halls[i]._id == $scope.selectedHall._id)
			{
				$scope.halls[i] = $scope.selectedHall;
				$scope.$apply();
			}
		}
	};

	// $scope.$watch("halls",function(newValue, oldValue){
	// 	for(var i =0 ;i <newValue.length;i++)
	// 	if(Date.now() > new Date(newValue.toString()))
	// 	{
	// 		//change occupancy.. either dequeue from blockQueue, shift to occupancy, or change occupancy.occupied to false
	// 		hall.occupancy = {occupied:false,occupiedBy:"",purpose:"",team:"",timeRange:{from:"",to:""}};
	// 	}
	// });
	
	setInterval(function(){
		if($scope.halls)
		{
			for(var i =0 ;i< $scope.halls.length;i++){
				var hall = $scope.halls[i];
				if(hall.occupancy.timeRange.to){
					if(Date.now() > new Date(hall.occupancy.timeRange.to.toString())){
						//change occupancy.. either dequeue from blockQueue, shift to occupancy, or change occupancy.occupied to false
						$scope.halls[i].occupancy = {occupied:false,occupiedBy:"",purpose:"",team:"",timeRange:{from:"",to:""}};
						socket.emit('updateHall',$scope.halls[i]);
					}
				}
			}
		}
		$scope.isSocketConnected = socket.socket.connected;
		$scope.$apply();
	},500);
	socket.on('updateHall',function(hallToBeUpdated){
		var i=0;
		$scope.$apply(function(){
			for(;i<$scope.halls.length;i++){
				if($scope.halls[i]._id == hallToBeUpdated._id){
					$scope.halls[i]= hallToBeUpdated;
					break;
				}
			}
		});
	});
});

app.filter('readableDate',function(){
	return function(timeStamp){
		if(timeStamp){
			var dateObj = new Date(timeStamp.toString());
			var date = dateObj.getDate();
			var month = dateObj.getMonth()+1;
			var year = dateObj.getFullYear();
			var hours = (0+ dateObj.getHours().toString()).slice(-2);
			var minutes = (0+ dateObj.getMinutes().toString()).slice(-2);
			return hours+":"+minutes+" "+date+"/"+month+"/"+year;
		}
	}
});