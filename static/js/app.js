/*! framework - v1.0.0 - 2016-12-4 */
app.config( ["$routeProvider", function ($routeProvider) {
	
	$routeProvider.when('/start', {
		templateUrl: '/static/page/app/depth.html',
		controller: "DepthCtrl"
	});

	$routeProvider.when('/my/list', {
		templateUrl: '/static/page/app/my_list.html',
		controller: "MyListCtrl"
	});

	$routeProvider.when('/files/list', {
		templateUrl: '/static/page/app/files_list.html',
		controller: "FilesListCtrl"
	});

	$routeProvider.when('/domain/list', {
		templateUrl: '/static/page/app/domain_list.html',
		controller: "DomainListCtrl"
	});

	$routeProvider.when('/qq/list', {
		templateUrl: '/static/page/app/qq_list.html',
		controller: "QqListCtrl"
	});
}]);

;
app.controller("DepthCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  "$timeout", "WebsocketService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService, $timeout, WebsocketService) {
	$scope.platform = {"huobi":{"name":"火币网", "rate":7}, "bithumb":{"name":"韩币网", "rate":0.0006}};
	$scope.depth = {
		"BTC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"ETH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"DASH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"LTC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"ETC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"XRP":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"BCH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"ZEC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"QTUM":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},

		},
		"EOS":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		}

	};

	$scope.profit = {
		"BTC":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"ETH":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"DASH":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"LTC":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"ETC":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"XRP":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"BCH":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"ZEC":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"QTUM":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
		"EOS":{"surplus":{"percent":0, "money":0}, "deficit":{"percent":0, "money":0}},
	};

	$scope.select = {
		"mode":[{"Id":0, "Name":"买卖"}, {"Id":1, "Name":"卖买"}],
		"order":[{"Id":0, "Name":"手动"}, {"Id":1, "Name":"自动"}],
	};
	////fee 币种的数量；cost 交易费：每一单总价的 XXX%；
	$scope.settings = {
		"surplus" : 15,
		"deficit" : 5,
		"mode":0,
		"order":0,
		"symbol":{
			"BTC":{"amount":1, "fee":0, "cost":0, "color":false},
			"ETH":{"amount":1, "fee":0, "cost":0, "color":false},
			"DASH":{"amount":1, "fee":0, "cost":0, "color":false},
			"LTC":{"amount":1, "fee":0, "cost":0, "color":false},
			"ETC":{"amount":1, "fee":0, "cost":0, "color":false},
			"XRP":{"amount":1, "fee":0, "cost":0, "color":false},
			"BCH":{"amount":1, "fee":0, "cost":0, "color":false},
			"ZEC":{"amount":1, "fee":0, "cost":0, "color":false},
			"QTUM":{"amount":1, "fee":0, "cost":0, "color":false},
			"EOS":{"amount":1, "fee":0, "cost":0, "color":false},
		},


	};

	$scope.transactionList = [];
	$scope.addTransaction = function( index ){
		var data = $scope.message[index];
		data.state = 1;
		$scope.transactionList.unshift(data);
		
	};
	
	
	$scope.message = [];

	$scope.$on('10000', function(event, data) {

			var obj = angular.fromJson(data);

			if ($scope.settings.symbol[obj.symbol].amount<=0 || (obj.bids == $scope.depth[obj.symbol][obj.platform].bids && obj.asks == $scope.depth[obj.symbol][obj.platform].asks) ){
				return
			}
			$scope.depth[obj.symbol][obj.platform] = obj;

			var huobi_bids = $scope.depth[obj.symbol]['huobi']['_bids'];
			var huobi_asks = $scope.depth[obj.symbol]['huobi']['_asks'];

			var bithumb_bids = $scope.depth[obj.symbol]['bithumb']['_bids'];
			var bithumb_asks = $scope.depth[obj.symbol]['bithumb']['_asks'];



			if(huobi_bids!=0 && huobi_bids !=0 && bithumb_bids!=0 && bithumb_asks!=0){
				$scope.settings.symbol[obj.symbol].color = true;
				$timeout(function(){
					$scope.settings.symbol[obj.symbol].color = false;
					return
				},500);
				//顺差计算
				$scope.profit[obj.symbol]["surplus"]['percent'] = ((bithumb_asks - huobi_bids  ) / huobi_bids) * 100;
				$scope.profit[obj.symbol]["surplus"]['money'] = (bithumb_asks - huobi_bids ) * $scope.settings.symbol[obj.symbol].amount;
				//逆差计算
				$scope.profit[obj.symbol]["deficit"]['percent'] = ((huobi_asks - bithumb_bids  ) / bithumb_bids) * 100;
				$scope.profit[obj.symbol]["deficit"]['money'] = (huobi_asks - bithumb_bids ) * $scope.settings.symbol[obj.symbol].amount;

				var data = {
					"symbol":obj.symbol,
					"mode":$scope.settings.mode,
					"buy":huobi_bids, 
					"sell":bithumb_asks, 
					"amount": $scope.settings.symbol[obj.symbol].amount, 
					"percent":$scope.profit[obj.symbol]["surplus"]['percent'], 
					"money":$scope.profit[obj.symbol]["surplus"]['money'] 
				};

				
				if ($scope.profit[obj.symbol]["surplus"]['percent'] < $scope.profit[obj.symbol]["deficit"]['percent']) {

					data['mode'] = "B->A";
					data['buy'] = bithumb_bids;
					data['sell'] = huobi_asks;
					data['buy'] = bithumb_bids;
					data['amount'] = bithumb_bids;
					data['percent'] = $scope.profit[obj.symbol]["deficit"]['percent'];
					data['money'] = $scope.profit[obj.symbol]["deficit"]['money'];

				}
				

				if (data['percent'] >= $scope["settings"].surplus) {
					$scope.message.unshift(data);
				}
					
					
			}

			$scope.$apply()



	});

}]);
;

app.controller("DomainEditCtrl", ["$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg", function ($scope, $http, $filter, $modalInstance, curr_data, appCfg) {
	
	
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
		{"Key":"Domain", "Title":"域名", "InputType":"text", "Required":"true"},
		{"Key":"Sort", "Title":"排序", "InputType":"text-i", "Required":"true", "Min":1, "Max":100},
		{"Key":"Note", "Title":"备注", "InputType":"textarea", "Required":"false"},
	];	
	
	/***********************初始化*****************************/
	$scope.title = "添加域名";
	$scope.op =  angular.copy(curr_data.Op);
	$scope.oldData = angular.copy(curr_data.Data);
	$scope.editData = angular.copy($scope.oldData);
    $scope.postUrl = appCfg.AppPrefix +"/domain/add";

	if (curr_data.Op=='edit'){
		$scope.title= "编辑域名";
		$scope.postUrl = appCfg.AppPrefix +"/domain/edit";
	}



}])
;
app.controller("DomainListCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService) {

	$scope.config = configService.data;

	//**************************************************************
	$scope.search = {
						
						PageSize:10,//单页条数
						Page:1,//默认当前页为第一页
						Keyword:"",
						Status:0
					};


	$scope.getList = function() {
		var url = appCfg.AppPrefix + "/domain/list";
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
            controller: "DomainEditCtrl",
            resolve: {
            	curr_data: function () {
                    return {"Op":"add", "Data":{"Sort":100}};
                }
            }
        }), modalInstance.result.then(function (data) {
        	$scope.getList();
        });	
	};
	
	$scope.edit = function(id) {
		
		var url = appCfg.AppPrefix + "/domain/edit/" + id;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				 modalInstance = $modal.open({
					backdrop: false,
		            templateUrl: "/static/page/modal/base.html",
		            controller: "DomainEditCtrl",
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
		EzConfirm.create({heading: '域名删除', text: '确定删除域名“'+item.Name+'“吗？'}).then(function() {
        	var post = angular.copy(item);  
			var url = appCfg.AppPrefix + "/domain/del";
			$http.post(url, post).success(function(data, status, headers, config) {
				if($filter("CheckError")(data)){
					$scope.getList();
					storeService.getList(); 
				}
			});		  	
		});
	};
	
	$scope.getList();
}]);
;

app.controller("FilesEditCtrl", ["$sce", "$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg", function ($sce, $scope, $http, $filter, $modalInstance, curr_data, appCfg) {
	
	
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
		{"Key":"Domain", "Title":"域名", "InputType":"text", "Required":"true"},
		{"Key":"Sort", "Title":"排序", "InputType":"text-i", "Required":"true", "Min":1, "Max":100},
		{"Key":"Note", "Title":"备注", "InputType":"text", "Required":"false"},
	];	
	
	/***********************初始化*****************************/
	$scope.title = "文件上传";
	$scope.op =  angular.copy(curr_data.Op);
	$scope.oldData = angular.copy(curr_data.Data);
	$scope.editData = angular.copy($scope.oldData);
    $scope.postUrl = appCfg.AppPrefix +"/files/add";

	if (curr_data.Op=='edit'){
		$scope.title= "编辑文件";
		$scope.postUrl = appCfg.AppPrefix +"/files/edit";
	}
	if (curr_data.Op=='play'){
		$scope.title= $scope.oldData.FileName +"--播放测试";

		var url = encodeURI("http://jdyun.com/?vid=" + $scope.oldData.Key);
		
		$scope.playUrl = $sce.trustAsResourceUrl("http://123.172.7.3:8200/jx/?url="+url);


	}



}])
;

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
;
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
;

app.controller("QqEditCtrl", ["$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg", function ($scope, $http, $filter, $modalInstance, curr_data, appCfg) {
	
	
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
		{"Key":"Qq", "Title":"QQ账号", "InputType":"text", "Required":"true"},
		{"Key":"Password", "Title":"QQ密码", "InputType":"text", "Required":"true"},
		{"Key":"Cookie", "Title":"Cookie", "InputType":"textarea", "Required":"true"},
	];	
	
	/***********************初始化*****************************/
	$scope.title = "添加QQ小号";
	$scope.op =  angular.copy(curr_data.Op);
	$scope.oldData = angular.copy(curr_data.Data);
	$scope.editData = angular.copy($scope.oldData);
    $scope.postUrl = appCfg.AppPrefix +"/qq/add";

	if (curr_data.Op=='edit'){
		$scope.title= "编辑QQ小号";
		$scope.postUrl = appCfg.AppPrefix +"/qq/edit";
	}



}])
;
app.controller("QqListCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService) {

	$scope.config = configService.data;

	//**************************************************************
	$scope.search = {
						
						PageSize:10,//单页条数
						Page:1,//默认当前页为第一页
						Keyword:"",
						Status:0
					};


	$scope.getList = function() {
		var url = appCfg.AppPrefix + "/qq/list";
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
            controller: "QqEditCtrl",
            resolve: {
            	curr_data: function () {
                    return {"Op":"add", "Data":{"Sort":100}};
                }
            }
        }), modalInstance.result.then(function (data) {
        	$scope.getList();
        });	
	};
	
	$scope.edit = function(id) {
		
		var url = appCfg.AppPrefix + "/qq/edit/" + id;
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				 modalInstance = $modal.open({
					backdrop: false,
		            templateUrl: "/static/page/modal/base.html",
		            controller: "QqEditCtrl",
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
		EzConfirm.create({heading: 'QQ小号删除', text: '确定删除“'+item.Qq+'“吗？'}).then(function() {
        	var post = angular.copy(item);  
			var url = appCfg.AppPrefix + "/qq/del";
			$http.post(url, post).success(function(data, status, headers, config) {
				if($filter("CheckError")(data)){
					$scope.getList();
				}
			});		  	
		});
	};
	
	$scope.getList();
}]);
;
app.directive("flotChart", [function () {
    return {
        restrict: "A", scope: {data: "=", options: "="}, link: function (scope, ele) {
            var data, options, plot;
            return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options)
        }
    }
}]);
;
app.directive("flotChartRealtime", [function () {
    return {
        restrict: "A", link: function (scope, ele) {
            var data, getRandomData, plot, totalPoints, update, updateInterval;
            return data = [], totalPoints = 500, getRandomData = function () {
                var i, prev, res, y;
                for (data.length > 0 && (data = data.slice(1)); data.length < totalPoints;)prev = data.length > 0 ? data[data.length - 1] : 50, y = prev + 10 * Math.random() - 5, 0 > y ? y = 0 : y > 100 && (y = 100), data.push(y);
                for (res = [], i = 0; i < data.length;)res.push([i, data[i]]), ++i;
                return res
            }, update = function () {
                plot.setData([getRandomData()]), plot.draw(), setTimeout(update, updateInterval)
            }, data = [], totalPoints = 500, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
                series: {
                    lines: {
                        show: !0,
                        fill: !1
                    }, shadowSize: 0
                },
                yaxis: {min: 0, max: 100},
                xaxis: {show: !1},
                grid: {hoverable: !0, borderWidth: 1, borderColor: "#eeeeee"},
                colors: ["#70b1cf"]
            }), update()
        }
    }
}]);
;
app.directive('message', ['$timeout',function($timeout) {
	return {
		restrict: 'E',
		templateUrl: '/static/chat/message.html?'+version,
		scope:{
			info:"=",
			self:"=",
			language:"=",
			selectfromuser:"&",
			selecttouser:"&",
			scrolltothis:"&",
			translate:"&"
		},
		link:function(scope, elem, attrs){
			scope.time=new Date();
			$timeout(scope.scrolltothis);

		}
	};
}])
;
app.directive("morrisChart", [function () {
    return {
        restrict: "A", scope: {data: "=", type: "=", options: "="}, link: function (scope, ele) {
            var data, func, options, type;
            switch (data = scope.data, type = scope.type) {
                case"line":
                    return options = angular.extend({
                        element: ele[0],
                        data: data
                    }, scope.options), new Morris.Line(options);
                case"area":
                    return options = angular.extend({
                        element: ele[0],
                        data: data
                    }, scope.options), new Morris.Area(options);
                case"bar":
                    return options = angular.extend({
                        element: ele[0],
                        data: data
                    }, scope.options), new Morris.Bar(options);
                case"donut":
                    return options = angular.extend({
                        element: ele[0],
                        data: data
                    }, scope.options), options.formatter && (func = new Function("y", "data", options.formatter), options.formatter = func), new Morris.Donut(options)
            }
        }
    }
}]);
;
app.directive("sparkline", [function () {
    return {
        restrict: "A", scope: {data: "=", options: "="}, link: function (scope, ele) {
            var data, options, sparklineDraw;
            return data = scope.data, options = scope.options, sparklineDraw = function () {
                return ele.sparkline(data, options)
            }, $(window).resize(function () {
                var sparkResize;
                return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200)
            }), sparklineDraw()
        }
    }
}]);
;
app.directive('zyupload', ["$rootScope",function($rootScope) {
    return {
        restrict: 'E',
        template: '<div id="zyupload" class="zyupload"></div>',
        link:function(scope, element, attrs){
                
				// 初始化插件
				$("#zyupload").zyUpload({
					width: "100%", 							// 宽度 
				    height: "100%", 						// 高度 
				    itemWidth: "100px", 					// 文件项的宽度 
				    itemHeight: "80px", 					// 文件项的高度 
				    url: "/admin/album/add", 				// 上传文件的路径 
				    fileType: ["jpg", "png"], 	// 上传文件的类型 
				    fileSize: 51200000, 					// 上传文件的大小 
				    multiple: true, 						// 是否可以多个文件上传 
				    dragDrop: false, 						// 是否可以拖动上传文件 
				    tailor: false, 							// 是否可以裁剪图片 
				    del: true, 								// 是否可以删除文件 
				    finishDel: true, 						// 是否在上传文件完成后删除预览 
					/* 外部获得的回调接口 */
					onSelect: function(files, allFiles){                    // 选择文件的回调方法
						
						console.info("当前选择了以下文件：");
						console.info(files);
						console.info("之前没上传的文件：");
						console.info(allFiles);
					},
					onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
						console.info("当前删除了此文件：");
						console.info(file);
						console.info("当前剩余的文件：");
						console.info(surplusFiles);
					},
					onSuccess: function(file, responseInfo ){                    // 文件上传成功的回调方法
						$rootScope.$broadcast("uploadSuccess", responseInfo);
						console.info("此文件上传成功：");
						console.info(file);
					},
					onFailure: function(file){                    // 文件上传失败的回调方法
						console.info("此文件上传失败：");
						console.info(file);
					},
					onComplete: function(responseInfo){           // 上传完成的回调方法
						$rootScope.$broadcast("uploadComplete", responseInfo);
						console.info("文件上传完成");
						console.info(responseInfo);
					}
				});
               
        }
    };
}])


;
app.filter('arrayAttr', [function() {  
	   return function(id, array, attr) {
	      for (var i=0; i<array.length; i++) {
	    	  if (array[i].Id==id) {
	    		  return array[i][attr];
	    	  }
	      }
	      return "无";
	   };  
	}]);

;
app.filter('FileSize', [function() {  
	return  function(bytes) {
        if (bytes === 0) return '0 B';

        var k = 1024;

        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
    };  
}]);

;
app.service('categoryService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
	var self = this;
	
	this.data = {
			"Items":[]
	};
	
	this.getList = function() {
		var url = appCfg.AppPrefix + "/apppub/category";
		
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				self.data.Items = data.Data;
			}
		})
		.error(function(data, status, headers, config) {
			
		});
	};
	
	this.getList();
}]);


;
app.service('typeService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter,  appCfg) {
	var self = this;
	
	this.data = {
			"Items":[]
	};
	
	this.getList = function() {
		var url = appCfg.AppPrefix + "/apppub/type";
		
		$http.get(url).success(function(data, status, headers, config) {
			if($filter("CheckError")(data)){
				self.data.Items = data.Data;
			}
		})
		.error(function(data, status, headers, config) {
			
		});
	};
	
	this.getList();
}]);


;
app.service('WebsocketService', ['$rootScope','LoginService', function($rootScope, LoginService) {
    var proto = {
		"EReqLogin":10001, 		// 登录
		"EResLogin":20001,
		"EReqJionRoom":10002, 	// 加入房间
		"EResJionRoom":20002,
		"EReqLeaveRoom":10003, 	// 离开房间
		"EResLeaveRoom":20003,
		"EReqChat":10004, 		// 聊天
		"EResChat":20004,
		"EReqRoomList":10005, 	// 房间列表
		"EResRoomList":20005,
		"EReqAddRoom":10006, 	// 添加房间
		"EResAddRoom":20006,
		"EReqDelRoom":10007, 	// 删除房间
		"EResDelRoom":20007,
		"EReqUpRoom":10008, 	// 更新房间
		"EResUpRoom":20008,
		"EReqRoomUserList":10009, // 获得房间用户列表
		"EResRoomUserList":20009,
		"EReqUseItem":10011,		//使用道具
		"EResUseItem":20011,			//使用道具返回
		"EReqFriendList":10013,		//获取好友在线信息
		"EResFriendList":20013		//好友在线信息返回


	};
	
	var Service = {};
 
    var ws = null;
	var conn = false;
	var reconn = false;
	
	//默认连接服务器
	connectServer();
   

	function connectServer(){
	 	ws = new WebSocket("ws://" + weburl + "/depth/join");
	 	ws.onopen = function(){
			//通知roomCtrl，可以进行登录 
			conn = true;
	    };
	    
	    ws.onclose = function () {
			console.log("连接关闭");
			conn = false;
		};
		
		ws.onerror = function(e) {
			for ( var p in e) {
				console.log(p + "=" + e[p]);
			}
		}
	
	    ws.onmessage = function(message) {
			
			var data = angular.fromJson(message.data);
			
 			//console.log(data);

	        switch (data.Type) {
		        case 0: // JOIN
		           
		            break;
		        case 1: // LEAVE
		            
		            break;
		        case 2: // MESSAGE
			        $rootScope.$broadcast("10000", data.Content);
		            break;
	        }


	    };
	}

	//底层消息发送
	function sendRequest(request) {
		if (!conn){
			alert("已经断开连接，请从新连接服务器");
			return;
		}
		ws.send(JSON.stringify(request));
	}

	Service.conn = conn;
	//从新连接服务器
	Service.reConnectServer = function(){
		reconn = true;
		ws.close(1000);
	}


	//发送消息
    Service.sendMessage = function(type, tuid, content){

		if (angular.isObject(content)) {
			content = angular.toJson(content);
		}

	  	var request = {
			"Proto":proto.EReqChat,
			"Content":angular.toJson({"ChatType":type, "ToUserId":tuid,"Content":content})
	  	};
	 	sendRequest(request);
	  
    };



	//返回对象
    return Service;
}])
