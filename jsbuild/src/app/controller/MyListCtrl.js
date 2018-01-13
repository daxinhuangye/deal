app.controller("MyListCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  "categoryService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService, categoryService) {

	$scope.config = configService.data;
	$scope.category = categoryService.data;

	//**************************************************************
	$scope.search = {
						PageSize:15,//单页条数
						Page:1,//默认当前页为第一页
						Keyword:"",
					};


	$scope.getList = function() {
		var url = appCfg.AppPrefix + "/my/list";
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
            templateUrl: "/static/page/modal/my_add.html?"+version,
            controller: "MyEditCtrl",
            resolve: {
            	curr_data: function () {
					 return {"Op":"add", "Data":{"Sort":100}};
                }
            }
        });		
	};

	
	$scope.edit = function(id) {
		
		var url = appCfg.AppPrefix + "/my/edit/" + id;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				 modalInstance = $modal.open({
					backdrop: false,
		            templateUrl: "/static/page/modal/base.html",
		            controller: "MyEditCtrl",
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
	
	$scope.play = function(key) {

		var url = appCfg.AppPrefix + "/my/play/" + key;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				 modalInstance = $modal.open({
					backdrop: false,
		            templateUrl:"/static/page/modal/files_play.html?"+version,
		            controller: "MyEditCtrl",
		            resolve: {
		            	curr_data: function () {
		                    return {"Op":"play", "Data":data.Data};
		                }
		            }
		      
		        });
			}
		});

	};

	$scope.download = function(key) {

		var url = appCfg.AppPrefix + "/my/download/" + key;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				window.location.href = data.Data.DownloadUrl;
			}
        })  
       
	};

	$scope.activation = function(key) {

		var url = appCfg.AppPrefix + "/my/activation/" + key;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				alert("激活成功");
			}
        })  
       
	};


	$scope.del = function(item) {
		EzConfirm.create({heading: '文件删除', text: '确定删除-“'+item.Name+'“吗？'}).then(function() {
        	var post = angular.copy(item);  
			var url = appCfg.AppPrefix + "/my/del";
			$http.post(url, post).success(function(data, status, headers, config) {
				if($filter("CheckError")(data)){
					$scope.getList();
				}
			});		  	
		});
	};
	

	$scope.getList();
}]);