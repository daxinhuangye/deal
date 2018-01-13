
app.controller("MyEditCtrl", ["$sce", "$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg",  "categoryService", function ($sce, $scope, $http, $filter, $modalInstance, curr_data, appCfg, categoryService) {
	
	
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
		{"Key":"Name", "Title":"文件名", "InputType":"text", "Required":"true"},
		{"Key":"Category", "Title":"分类", "InputType":"select", "Required":"true", "Value":categoryService.data.Items},

	];	
	
	/***********************初始化*****************************/
	$scope.title = "文件上传";
	$scope.op =  angular.copy(curr_data.Op);
	$scope.oldData = angular.copy(curr_data.Data);
	$scope.editData = angular.copy($scope.oldData);
   
	if (curr_data.Op=='edit'){
		$scope.title= "编辑文件";
		$scope.postUrl = appCfg.AppPrefix +"/my/edit";
	}

	if (curr_data.Op=='play'){
		$scope.title= $scope.oldData.FileName +"--播放测试";

		var url = encodeURI("http://jdyun.com/?vid=" + $scope.oldData.Key);
		
		$scope.playUrl = $sce.trustAsResourceUrl("http://123.172.7.3:8200/jx/?url="+url);

	}



}])