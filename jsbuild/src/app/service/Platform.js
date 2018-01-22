app.service('PlatformService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
	var self = this;

	this.data = {
		"Items":[]
	};
	
	this.getData = function() {
		var url = appCfg.AppPrefix + "/apppub/platform";
		
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				self.data.Items = data.Data;
			}
		})
		.error(function(data, status, headers, config) {
			
		});
	};
	
	this.getData();
}]);
