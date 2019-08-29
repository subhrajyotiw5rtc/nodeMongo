var dept=angular.module('SSMS');
dept.controller('dashboardController',function($scope,$http,$state,$window,DataService){
	$scope.listOfStatus=[];
	var url1='subStatus';
	var method='GET';
	var data1='';
	DataService.connectToServerSideScript(method,url1,data1)
	.then(function(response) {
		//console.log('response',response.arr);
    	if (response.data.length >0) {
			$scope.listOfStatus=response.data;
		}else{
			$scope.listOfStatus=[];
		}
		$scope.cname=response.arr.collection;
		$scope.record=response.arr.count;
		$scope.time=response.arr.diff;
	},function(error) {
	    
	})
	$scope.addStatusData=function(){
		var url1='checkCount';
		var method='POST';
		var userData={state:$scope.state,status:$scope.status};
		console.log('data',userData);
		DataService.connectToServerSideScript(method,url1,userData)
		.then(function(response) {
			console.log('response',response);
	    	
		},function(error) {
		    
		})
	}
})