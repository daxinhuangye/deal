app.service('BalanceService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
	var self = this;
	
	this.data = {};
	
	this.getData = function() {
		var url = appCfg.AppPrefix + "/api/balance";
		
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				self.data = data.Data;
			}
		})
		.error(function(data, status, headers, config) {
			
		});
	};
	
	this.getData();
}]);

