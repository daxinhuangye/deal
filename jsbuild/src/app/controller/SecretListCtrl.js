app.controller("SecretListCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "PlatformService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, PlatformService) {

	$scope.platform = PlatformService.data;

	//**************************************************************
	$scope.search = {
						
						PageSize:10,//单页条数
						Page:1,//默认当前页为第一页
						Keyword:"",
						Status:0
					};


	$scope.getList = function() {
		var url = appCfg.AppPrefix + "/secret/list";
		$http.post(url, $scope.search).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				$scope.listData= data.Data;
			}
		});	
	};


	var modalInstance;

	$scope.add = function() {
		
        modalInstance = $modal.open({
			backdrop: false,
            templateUrl: "/static/page/modal/base.html",
            controller: "SecretEditCtrl",
            resolve: {
            	curr_data: function () {
                    return {"Op":"add", "Data":{}};
                }
            }
        }), modalInstance.result.then(function (data) {
        	$scope.getList();
        });	
	};
	
	$scope.edit = function(id) {
		
		var url = appCfg.AppPrefix + "/secret/edit/" + id;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				 modalInstance = $modal.open({
					backdrop: false,
		            templateUrl: "/static/page/modal/base.html",
		            controller: "SecretEditCtrl",
		            resolve: {
		            	curr_data: function () {
		                    return {"Op":"edit", "Data":data.Data};
		                }
		            }
		        }), modalInstance.result.then(function (data) {
		        	$scope.getList();
		        });
			}
		});
       
	};
	     

	$scope.del = function(item) {
		EzConfirm.create({heading: '秘钥删除', text: '确定删除吗？'}).then(function() {
        	var post = angular.copy(item);  
			var url = appCfg.AppPrefix + "/secret/del";
			$http.post(url, post).success(function(data, status, headers, config) {
				if($filter("CheckError")(data)){
					$scope.getList();
				}
			});		  	
		});
	};
	
	$scope.getList();
}]);