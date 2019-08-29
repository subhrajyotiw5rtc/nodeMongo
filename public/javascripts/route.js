var Admin=angular.module('SSMS',['ui.router']);
Admin.run(function($rootScope, $state) {
    $rootScope.$state = $state;
});
Admin.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('/',{
		url: '/',
        templateUrl: 'view/dashboard.html',
		controller: 'dashboardController'
	})
	/*$locationProvider.html5Mode({
      enabled: true,
      requireBase: true
    }).hashPrefix('!');*/
})
Admin.factory('DataService', DataService);
function DataService($http, $q){
	return{
		connectToServerSideScript:connectToServerSideScript
	}
	function connectToServerSideScript(method,url,userData){
		//console.log('deffered',method,url,userData);
		var deferred = $q.defer();
		$http({
			method:method,
			url:url,
			data:userData,
			//headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function(response) {
			//console.log('data defer',response.data);
			deferred.resolve(response.data);
		},function(error) {
			deferred.reject(error.data);
		})
		//console.log('data defer',deferred.promise);
		return deferred.promise;
	}

}