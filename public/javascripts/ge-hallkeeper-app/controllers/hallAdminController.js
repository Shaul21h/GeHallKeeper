app.controller("hallAdminController",function($scope,$http){
	$scope.halls = null;
	$scope.data = {
		isNew: "false",
		hall:{
			occupancy:{
				occupied:"false"
			}
		}
	};
	$scope.init = function(){
		$http.get('/getHalls').
		success(function(data){
			$scope.halls = data;
			
		}).
		error(function(data){
			console.log('error in fetching halls');
		});
	};
	$scope.editHallName = function(){
		var name = prompt("Enter name:",$scope.data.hall.name);
		if(name!="" && name!=null){
			$scope.data.hall.name=name;
		}
	}
	$scope.$watch("data.isNew",function(newValue,oldValue){
		if(newValue=="true"){
			$scope.data.hall = {};
		}
	});

	$scope.submitButtonText= function(){
		if($scope.data.isNew=="true")
			return "Create";
		else
			return "Update";
	};
	$scope.submitForm = function(){
		console.log($scope.data.hall);
		$http.post("/admin/hallAdmin/createUpdate",$scope.data.hall).success(function(){
			console.log('posted hall data');
		});
	};
});
app.directive('makearray',function(){
	return {
		require:'ngModel',
		link:function(scope,element,attrs,modelCtrl){
			modelCtrl.$parsers.push(function(inputValue){
				var arrayedOutput = inputValue.split(",");
				return arrayedOutput;
			});
		}
	};
});
// app.directive('datify',function(){
// 	return {
// 		require:'ngModel',
// 		restrict:'E',
// 		scope:{
// 			myVal:'='
// 		},
// 		link:function(scope,element,attrs,modelCtrl){
// 			console.log(scope);
// 			console.log(scope.myVal);
// 			modelCtrl.$setViewValue(scope.myval);

// 			modelCtrl.$formatters.unshift(function(valueFromModel){
// 				//return $filter('propertime')(valueFromModel);
// 				console.log(valueFromModel);
// 				if(valueFromModel){
// 					console.log(valueFromModel);
// 					var dateObj = new Date(valueFromModel.toString());
// 					var date = dateObj.getDate();
// 					var month = dateObj.getMonth()+1;
// 					var year = dateObj.getFullYear();
// 					var hours = (0+ dateObj.getHours().toString()).slice(-2);
// 					var minutes = (0+ dateObj.getMinutes().toString()).slice(-2);
// 					return hours+":"+minutes;//+" "+date+"/"+month+"/"+year;
// 				}
// 			});

// 			modelCtrl.$parsers.push(function(inputValue){ //comes from the view
// 				console.log(inputValue);
// 				var times = inputValue.split(":");
// 				var hours = times[0];
// 				var mins = times[1];
// 				var currentDate = new Date();
// 				var outputDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(),hours,mins);
// 				return outputDate.toString(); //goes to the model
// 			});
// 		}
// 	};
// });

app.directive('datify',function($parse){
	return {
		require:'ngModel',
		restrict:'A',
		link:function(scope,element,attrs,modelCtrl){
			// console.log(scope);
			// console.log(scope.myVal);

			var model = $parse(attrs.datify)
			scope.$watch(model, function (value) {
                if(value && value.toString().split(":").length == 2) {
                    backToDate(value)
                }
            },true); // end watch

			function backToDate(value) {
                var times = value.split(":");
                var hours = times[0];
                var mins = times[1];
                var currentDate = new Date();
                var outputDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), hours, mins);
                modelCtrl.$setViewValue(outputDate);
            }

			function validate(value){
				console.log('into validate');
				var otherFieldValue= model(scope);
				console.log('validate: ',value,otherFieldValue);
				var outputDate=null;
				if(value){
					var outputDate = new Date(value.toString());
					console.log("the date:", outputDate);
				}
				modelCtrl.$setViewValue(outputDate);
				return outputDate;
				//}
				
			};
			modelCtrl.$formatters.push(validate);
			// modelCtrl.$parsers.push(function(inputValue){ //comes from the view
			// 	console.log(inputValue);
			// 	var times = inputValue.split(":");
			// 	var hours = times[0];
			// 	var mins = times[1];
			// 	var currentDate = new Date();
			// 	var outputDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(),hours,mins);
			// 	return outputDate.toString(); //goes to the model
			// });
		}
	};
});
app.filter('propertime',function(){
	return function(timeStamp){
		if(timeStamp){
			var dateObj = new Date(timeStamp.toString());
			var date = dateObj.getDate();
			var month = dateObj.getMonth()+1;
			var year = dateObj.getFullYear();
			var hours = (0+ dateObj.getHours().toString()).slice(-2);
			var minutes = (0+ dateObj.getMinutes().toString()).slice(-2);
			return hours+":"+minutes;//+" "+date+"/"+month+"/"+year;
		}
	}
});