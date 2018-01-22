app.controller("SecretEditCtrl", ["$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg", "PlatformService", function ($scope, $http, $filter, $modalInstance, curr_data, appCfg, PlatformService) {
	
	
    $scope.cancel = function () {
    	$modalInstance.dismiss("cancel");
    };   
	
    $scope.reset = function() {
    	$scope.editData = angular.copy($scope.oldData);
    };
    
    $scope.change = function(attr) {
    	if (attr.length==0) {
    		for (var attr in $scope.editData) {
    			if (!$scope.oldData.hasOwnProperty(attr)) {
    				return true;
    			}
    			if ($scope.oldData[attr] != $scope.editData[attr]) {
            		return true;
            	}
    		}
        	return false;    		
    	} else {
			if (!$scope.oldData.hasOwnProperty(attr)) {
				return true;
			}
    		if ($scope.oldData[attr] != $scope.editData[attr]) {
        		return true;
        	}
        	return false;
    	}
    	return false;
    };
    
    $scope.save = function() {

		$http.post($scope.postUrl, $scope.editData).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				$modalInstance.close(data);
			}
		});

    };
	/***********************数据定义*****************************/
	$scope.attrDef = [
		{"Key":"Pid", "Title":"平台类型", "InputType":"select", "Required":"true", "Value":PlatformService.data.Items},
		{"Key":"AccessKey", "Title":"AccessKey", "InputType":"text", "Required":"true"},
		{"Key":"SecretKey", "Title":"SecretKey", "InputType":"text", "Required":"true"},
	];	
	
	/***********************初始化*****************************/
	$scope.title = "添加平台秘钥";
	$scope.op =  angular.copy(curr_data.Op);
	$scope.oldData = angular.copy(curr_data.Data);
	$scope.editData = angular.copy($scope.oldData);
    $scope.postUrl = appCfg.AppPrefix +"/secret/add";

	if (curr_data.Op=='edit'){
		$scope.title= "编辑平台秘钥";
		$scope.postUrl = appCfg.AppPrefix +"/secret/edit";
	}



}])