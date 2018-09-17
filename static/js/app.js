/*! framework - v1.0.0 - 2016-12-4 */
app.config( ["$routeProvider", function ($routeProvider) {
	
	$routeProvider.when('/start', {
		templateUrl: '/static/page/app/depth.html',
		controller: "DepthCtrl"
	});
	$routeProvider.when('/quanti', {
		templateUrl: '/static/page/app/quanti.html',
		controller: "QuantiCtrl"
	});
	$routeProvider.when('/secret/list', {
		templateUrl: '/static/page/app/secret_list.html',
		controller: "SecretListCtrl"
	});

	$routeProvider.when('/order/list', {
		templateUrl: '/static/page/app/order_list.html',
		controller: "OrderListCtrl"
	});

}]);

;
app.controller("DepthCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "PlatformService", "SymbolService", "$timeout", "WebsocketService","BalanceService", "SettingsService","OrderService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, PlatformService, SymbolService, $timeout, WebsocketService, BalanceService, SettingsService, OrderService) {
    $('<audio id="Audio1"><source src="/static/sound/warning.wav" type="audio/wav"></audio>').appendTo('body');
	
	$scope.height = $scope.windowHeight - 90;

	//平台数据
	$scope.platform = PlatformService.data;
	//币种数据
	$scope.symbol = SymbolService.data;

	//资产状态
	$scope.balance = BalanceService.data;
	//更新资产状况
    $scope.getBalance = function(){
        BalanceService.getData();
    };

	//订单列表
	$scope.order = OrderService.data;

	$scope.tab = 0;
	$scope.active = function(tab) {
        $scope.tab = tab;
	};

	

	$scope.depth2 = {
		"BTC":[],
		"ETH":[],
		"DASH":[],
		"LTC":[],
		"ETC":[],
		"XRP":[],
		"BCH":[],
		"ZEC":[],
		"QTUM":[],
		"EOS":[]
	};

	$scope.upDepth2 = function(data ){
        var key=-1;
		for (var i=0; i<$scope.depth2[data.symbol].length; i++) {
            if ($scope.depth2[data.symbol][i].platform == data.platform) {
            	key = i;
            	break;
            }
        }
		if (key >-1) {
			$scope.depth2[data.symbol][key] = data;
		}else{
			$scope.depth2[data.symbol].push(data)
		}
	};

	//行情数据
	$scope.depth = {
		"1":{
			"platform":1,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},

		"2":{
			"platform":2,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"3":{
			"platform":3,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"4":{
			"platform":4,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"5":{
			"platform":5,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"6":{
			"platform":6,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"7":{
			"platform":7,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"8":{
			"platform":8,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"9":{
			"platform":9,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"10":{
			"platform":10,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},

	};

	//下拉配置
	$scope.select = {
		"mode":[{"Id":1, "Name":"买卖"}, {"Id":2, "Name":"卖买"}, {"Id":3, "Name":"同时"}],
		"order":[{"Id":1, "Name":"手动"}, {"Id":2, "Name":"自动"}],
		"type":[{"Id":1, "Name":"顺差"}, {"Id":2, "Name":"逆差"}],
	};

	//参数配置
	$scope.settings = SettingsService.data;

	$scope.settingsSave = function(){
		$scope.sortList=[];
		SettingsService.save();
	};

	//差值排序
	$scope.sortList = [];
	$scope.upSort = function(data ){
        var key=-1;
		for (var i=0; i<$scope.sortList.length; i++) {
            if ($scope.sortList[i].key == data.key) {
            	key = i;
            	break;
            }
        }
		if (key >-1) {
			$scope.sortList[key] = data;
		}else{
			$scope.sortList.push(data)
		}
	};
	//默认排序
	$scope.sort = "-percent";
	$scope.chsrot = function(){
		$scope.sort = $scope.sort == "-percent" ? "percent" : "-percent";
	};
	$scope.filters = 1;
	$scope.searcha = function(obj){
		return obj.platformA == $scope.filters || obj.platformA == 2;
	};

	//订单模块
	$scope.transactionList = [];
	$scope.addOrder = function( symbol, type ){
		//默认是顺差数据
		var data = {
			"index":index++,
			"symbol":symbol,
			"mode":$scope.settings.Items.mode,
			"buy":$scope.depth[symbol]['1']['_bids'],
			"sell":$scope.depth[symbol]['2']['_asks'],
			"amount": $scope.settings.Items.symbol[symbol].amount,
			"percent":$scope.profit[symbol]["surplus"]['percent'],
			"money":$scope.profit[symbol]["surplus"]['money'],
			"type":1
		};

		if (type == 1) {
			data['buy'] = $scope.depth[symbol]['2']['_bids'];
			data['sell'] = $scope.depth[symbol]['1']['_asks'];
			data['percent'] = $scope.profit[symbol]["deficit"]['percent'];
			data['money'] = $scope.profit[symbol]["deficit"]['money'];
			data['type'] = 2;
		}

		$scope.transactionList.push(data);

	};

	$scope.addTransaction = function( index ){

		var data = $scope.message[index];
		data.state = 1;
		$scope.transactionList.push(data);
		
	};
	

	//音效播放
 	$scope.playing = false;

    $scope.audio = document.createElement('audio');

    $scope.play = function() {	
		if(!$scope.playing) {
			$scope.audio.src = '/static/sound/warning.wav';
			$scope.audio.play(); 
			$scope.playing = true;
		}	
		
    };

    $scope.stop = function() {
		$scope.playId = 0;
        $scope.audio.pause();
        $scope.playing = false;
    };
	/*
   $scope.audio.addEventListener('ended', function() {
        $scope.$apply(function() {
            $scope.stop()
        });
    });
	*/
/////////////////////////////

	$scope.message = [];
	var index = 0;
	$scope.$on('10000', function(event, data) {

		var obj = angular.fromJson(data);
		//初始化颜色数据
		obj.color = {"bids":0, "asks":0};
		//通过汇率计算人民币
		obj._bids = $scope.settings.Items.rate[obj.platform] >0 ? obj.bids * $scope.settings.Items.rate[obj.platform] : obj.bids;
		obj._asks = $scope.settings.Items.rate[obj.platform] >0 ? obj.asks * $scope.settings.Items.rate[obj.platform] : obj.asks;

		//如果数量小于等于0 或者 买盘和卖盘都相等的话，直接返回
		if($scope.settings.Items.symbol[obj.platform][obj.symbol].amount <=0 ){
			return
		}
		//如果买盘和卖盘和原始数据都相等的话，直接返回
		if (obj.bids == $scope.depth[obj.platform][obj.symbol].bids && obj.asks == $scope.depth[obj.platform][obj.symbol].asks) {
			return
		}

		if(obj._bids.toFixed(2) != $scope.depth[obj.platform][obj.symbol]._bids.toFixed(2) ) {
			obj.color.bids = 1;
		}
		if(obj._asks.toFixed(2) != $scope.depth[obj.platform][obj.symbol]._asks.toFixed(2) ) {
			obj.color.asks = 1;
		}


		$scope.depth[obj.platform][obj.symbol] = obj;
		
		$scope.upDepth2( obj );


		var A_bids = $scope.depth[obj.platform][obj.symbol]._bids;
		var A_asks = $scope.depth[obj.platform][obj.symbol]._asks;

		//总价计算
		var A_bids_total = A_bids * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;
		var A_asks_total = A_asks * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;

		//计算交易费
		var A_bids_fee = A_bids_total * ($scope.settings.Items.symbol[obj.platform][obj.symbol].fee );
		var A_asks_fee = A_asks_total * ($scope.settings.Items.symbol[obj.platform][obj.symbol].fee );

		//计算转账费
		var A_transfer = A_asks * $scope.settings.Items.symbol[obj.platform][obj.symbol].transfer;


		//计算盈利
		for (i in $scope.platform.Items ) {
			//如果平台相等
			if($scope.platform.Items[i].Id == obj.platform ||  $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._bids == 0) {
				continue;
			}

			var B_bids = $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._bids;
			var B_asks = $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._asks;
			if (B_bids <= 0 || B_asks <= 0){
				continue;
			}

			var B_bids_total = B_bids * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;//$scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].amount;
			var B_asks_total = B_asks * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;//$scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].amount;

			//计算交易费
			var B_bids_fee = B_bids_total * ($scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].fee);
			var B_asks_fee = B_asks_total * ($scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].fee);

			//计算转账费
			var B_transfer = B_asks * $scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].transfer;


			//顺差计算
			var A_money = B_bids_total - A_asks_total - (B_bids_fee + A_asks_fee + A_transfer);
			var A_percent = (A_money / A_asks_total) * 100;
			//console.log(A_percent);
			//$scope.profit[obj.symbol]["surplus"]['formula'] = bithumb_bids_total +"-"+ huobi_asks_total +"-"+ bithumb_bids_fee +"-"+ huobi_asks_fee +"-"+ huobi_transfer;
			//逆差计算
			var B_money = A_bids_total - B_asks_total - (A_bids_fee + B_asks_fee + B_transfer) ;
			var B_percent = (B_money / B_asks_total) * 100;
			//$scope.profit[obj.symbol]["deficit"]['formula'] = huobi_bids_total +"-"+ bithumb_asks_total +"-"+ huobi_bids_fee +"-"+ bithumb_asks_fee +"-"+ bithumb_transfer ;
			//console.log(B_percent);
			
			if (A_percent>=$scope.settings.Items.surplus || B_percent>=$scope.settings.Items.surplus) {

				//$scope.play();
				$('#Audio1')[0].play();
			}

			var push_data1 = {
				"key":obj.symbol + "-" + obj.platform + "-" +$scope.platform.Items[i].Id,
				"symbol":obj.symbol,
				"platformA": obj.platform,
				"platformB": $scope.platform.Items[i].Id,
				"buy":A_asks,
				"sell":B_bids,
				"money":A_money,
				"percent": A_percent,
				"timestamp": Date.parse( new Date()),
				"msg":""
			} ;

			$scope.upSort(push_data1);

			var push_data2 = {
				"key":obj.symbol + "-" + $scope.platform.Items[i].Id + "-" + obj.platform ,
				"symbol":obj.symbol,
				"platformA": $scope.platform.Items[i].Id,
				"platformB": obj.platform,
				"buy":B_asks,
				"sell":A_bids,
				"money":B_money,
				"percent": B_percent,
				"timestamp": Date.parse( new Date()),
				"msg":""
			} ;

			$scope.upSort(push_data2);

			
			
		}

		//颜色处理
		$timeout(function(){
			$scope.depth[obj.platform][obj.symbol].color.bids = 0;
			$scope.depth[obj.platform][obj.symbol].color.asks = 0;
		},1000);



	});

	

}]);
;
app.controller("OrderEditCtrl", ["$scope", "$http", "$filter", "$modalInstance", "curr_data", "appCfg", function ($scope, $http, $filter, $modalInstance, curr_data, appCfg) {
	
	
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
app.controller("OrderListCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService) {

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
app.controller("QuantiCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "PlatformService", "SymbolService", "$timeout", "WebsocketService","BalanceService", "SettingsService","OrderService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, PlatformService, SymbolService, $timeout, WebsocketService, BalanceService, SettingsService, OrderService) {
    $scope.height = $scope.windowHeight - 100;

	//平台数据
	$scope.platform = PlatformService.data;
	//币种数据
	$scope.symbol = SymbolService.data;

	//资产状态
	$scope.balance = BalanceService.data;
	//更新资产状况
    $scope.getBalance = function(){
        BalanceService.getData();
    };

	//订单列表
	$scope.order = OrderService.data;

	$scope.tab = 0;
	$scope.active = function(tab) {
        $scope.tab = tab;
	};

	

	$scope.depth2 = {
		"BTC":[],
		"ETH":[],
		"DASH":[],
		"LTC":[],
		"ETC":[],
		"XRP":[],
		"BCH":[],
		"ZEC":[],
		"QTUM":[],
		"EOS":[]
	};

	$scope.upDepth2 = function(data ){
        var key=-1;
		for (var i=0; i<$scope.depth2[data.symbol].length; i++) {
            if ($scope.depth2[data.symbol][i].platform == data.platform) {
            	key = i;
            	break;
            }
        }
		if (key >-1) {
			$scope.depth2[data.symbol][key] = data;
		}else{
			$scope.depth2[data.symbol].push(data)
		}
	};

	//行情数据
	$scope.depth = {
		"1":{
			"platform":1,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},

		"2":{
			"platform":2,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"3":{
			"platform":3,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"4":{
			"platform":4,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"5":{
			"platform":5,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"6":{
			"platform":6,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"7":{
			"platform":7,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"8":{
			"platform":8,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"9":{
			"platform":4,
			"color":false,
			"BTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"DASH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"LTC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ETC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"XRP": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"BCH": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"ZEC": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"QTUM": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"EOS": {"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
	};

	//下拉配置
	$scope.select = {
		"mode":[{"Id":1, "Name":"买卖"}, {"Id":2, "Name":"卖买"}, {"Id":3, "Name":"同时"}],
		"order":[{"Id":1, "Name":"手动"}, {"Id":2, "Name":"自动"}],
		"type":[{"Id":1, "Name":"顺差"}, {"Id":2, "Name":"逆差"}],
	};

	//参数配置
	$scope.settings = SettingsService.data;

	$scope.settingsSave = function(){
		$scope.sortList=[];
		SettingsService.save();
	};

	//差值排序
	$scope.sortList = [];
	$scope.upSort = function(data ){
        var key=-1;
		for (var i=0; i<$scope.sortList.length; i++) {
            if ($scope.sortList[i].key == data.key) {
            	key = i;
            	break;
            }
        }
		if (key >-1) {
			$scope.sortList[key] = data;
		}else{
			$scope.sortList.push(data)
		}
	};
	//默认排序
	$scope.sort = "-percent";
	$scope.chsrot = function(){
		$scope.sort = $scope.sort == "-percent" ? "percent" : "-percent";
	};
	$scope.filters = 1;
	$scope.searcha = function(obj){
		return obj.platformA == $scope.filters || obj.platformA == 2;
	};

	//订单模块
	$scope.transactionList = [];
	$scope.addOrder = function( symbol, type ){
		//默认是顺差数据
		var data = {
			"index":index++,
			"symbol":symbol,
			"mode":$scope.settings.Items.mode,
			"buy":$scope.depth[symbol]['1']['_bids'],
			"sell":$scope.depth[symbol]['2']['_asks'],
			"amount": $scope.settings.Items.symbol[symbol].amount,
			"percent":$scope.profit[symbol]["surplus"]['percent'],
			"money":$scope.profit[symbol]["surplus"]['money'],
			"type":1
		};

		if (type == 1) {
			data['buy'] = $scope.depth[symbol]['2']['_bids'];
			data['sell'] = $scope.depth[symbol]['1']['_asks'];
			data['percent'] = $scope.profit[symbol]["deficit"]['percent'];
			data['money'] = $scope.profit[symbol]["deficit"]['money'];
			data['type'] = 2;
		}

		$scope.transactionList.push(data);

	};

	$scope.addTransaction = function( index ){

		var data = $scope.message[index];
		data.state = 1;
		$scope.transactionList.push(data);
		
	};
	
	
	$scope.message = [];
	var index = 0;
	$scope.$on('10000', function(event, data) {

		var obj = angular.fromJson(data);
		//初始化颜色数据
		obj.color = {"bids":0, "asks":0};
		//通过汇率计算人民币
		obj._bids = $scope.settings.Items.rate[obj.platform] >0 ? obj.bids * $scope.settings.Items.rate[obj.platform] : obj.bids;
		obj._asks = $scope.settings.Items.rate[obj.platform] >0 ? obj.asks * $scope.settings.Items.rate[obj.platform] : obj.asks;

		//如果数量小于等于0 或者 买盘和卖盘都相等的话，直接返回
		if (obj.bids == $scope.depth[obj.platform][obj.symbol].bids && obj.asks == $scope.depth[obj.platform][obj.symbol].asks) {
			return
		}

		if(obj._bids.toFixed(2) != $scope.depth[obj.platform][obj.symbol]._bids.toFixed(2) ) {
			obj.color.bids = 1;
		}
		if(obj._asks.toFixed(2) != $scope.depth[obj.platform][obj.symbol]._asks.toFixed(2) ) {
			obj.color.asks = 1;
		}


		$scope.depth[obj.platform][obj.symbol] = obj;
		
		$scope.upDepth2( obj );


		var A_bids = $scope.depth[obj.platform][obj.symbol]._bids;
		var A_asks = $scope.depth[obj.platform][obj.symbol]._asks;

		//总价计算
		var A_bids_total = A_bids * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;
		var A_asks_total = A_asks * $scope.settings.Items.symbol[obj.platform][obj.symbol].amount;
		//计算交易费
		var A_bids_fee = A_bids_total * ($scope.settings.Items.symbol[obj.platform][obj.symbol].fee / 100);
		var A_asks_fee = A_asks_total * ($scope.settings.Items.symbol[obj.platform][obj.symbol].fee / 100);

		//计算转账费
		var A_transfer = A_asks * $scope.settings.Items.symbol[obj.platform][obj.symbol].transfer;


		//计算盈利
		for (i in $scope.platform.Items ) {
			//如果平台相等
			if($scope.platform.Items[i].Id == obj.platform ||  $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._bids == 0) {
				continue;
			}

			var B_bids = $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._bids;
			var B_asks = $scope.depth[$scope.platform.Items[i].Id][obj.symbol]._asks;

			var B_bids_total = B_bids * $scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].amount;
			var B_asks_total = B_asks * $scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].amount;

			//计算交易费
			var B_bids_fee = B_bids_total * ($scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].fee / 100);
			var B_asks_fee = B_asks_total * ($scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].fee / 100);

			//计算转账费
			var B_transfer = B_asks * $scope.settings.Items.symbol[$scope.platform.Items[i].Id][obj.symbol].transfer;


			//顺差计算
			var A_money = B_bids_total - A_asks_total - (B_bids_fee + A_asks_fee + A_transfer);
			var A_percent = (A_money / A_asks_total) * 100;
			//console.log(A_percent);
			//$scope.profit[obj.symbol]["surplus"]['formula'] = bithumb_bids_total +"-"+ huobi_asks_total +"-"+ bithumb_bids_fee +"-"+ huobi_asks_fee +"-"+ huobi_transfer;
			//逆差计算
			var B_money = A_bids_total - B_asks_total - (A_bids_fee + B_asks_fee + B_transfer) ;
			var B_percent = (B_money / B_asks_total) * 100;
			//$scope.profit[obj.symbol]["deficit"]['formula'] = huobi_bids_total +"-"+ bithumb_asks_total +"-"+ huobi_bids_fee +"-"+ bithumb_asks_fee +"-"+ bithumb_transfer ;
			//console.log(B_percent);

			var push_data = {
				"key":obj.symbol + "-" + obj.platform + "-" +$scope.platform.Items[i].Id,
				"symbol":obj.symbol,
				"platformA": obj.platform,
				"platformB": $scope.platform.Items[i].Id,
				"buy":A_asks,
				"sell":B_bids,
				"money":A_money,
				"percent": A_percent,
				"timestamp": Date.parse( new Date()),
				"msg":""
			} ;
			$scope.upSort(push_data);

			var push_data = {
				"key":obj.symbol + "-" + $scope.platform.Items[i].Id + "-" + obj.platform ,
				"symbol":obj.symbol,
				"platformA": $scope.platform.Items[i].Id,
				"platformB": obj.platform,
				"buy":B_asks,
				"sell":A_bids,
				"money":B_money,
				"percent": B_percent,
				"timestamp": Date.parse( new Date()),
				"msg":""
			} ;
			$scope.upSort(push_data);

			
		}

		//颜色处理
		$timeout(function(){
			$scope.depth[obj.platform][obj.symbol].color.bids = 0;
			$scope.depth[obj.platform][obj.symbol].color.asks = 0;
		},1000);



	});
	

}]);
;
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
;
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
app.directive('resize', ["$window", function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;


        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}]);

;
app.directive('rightClick', ["$parse", function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
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
app.filter('search', [function() {
    return function(array, where) {

        var output = [];
        var timestamp = Date.parse( new Date()) ;
        var expired = 60000;
        if(angular.isDefined(where)){
            expired = where.expired * 1000;
        }

        angular.forEach(array, function (item) {
            //时间错过滤
            if ((timestamp - item.timestamp) < expired ){
                //币种是否满足条件
                if (angular.isDefined(where.symbol[item.symbol]) && where.symbol[item.symbol]) {
                    //主站是否满足条件
                    if (angular.isDefined(where.platformA[item.platformA]) && where.platformA[item.platformA]) {
						//次站是否满足条件
                        if (angular.isDefined(where.platformB[item.platformB]) && where.platformB[item.platformB]) {
                            item.msg =  ((timestamp - item.timestamp) / 1000).toFixed(0) + " 秒前";
                            output.push(item);
                        }
                    }
                }
            }


        });
        return output;
    };
}]);

;
app.service('BalanceService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
	var self = this;
	
	this.data = {
        "Items":{}
	};
	
	this.getData = function() {
        self.data.Items = {};
		var url = appCfg.AppPrefix + "/api/balance";
		
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


;
app.service('OrderService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
	var self = this;

	this.data = {
		"Items":[]
	};
	
	this.getList = function() {
		var url = appCfg.AppPrefix + "/order/list";
		
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


;
app.service('SettingsService', ["$rootScope", "$http", "$filter", "appCfg", "EzConfirm", function($rootScope, $http, $filter, appCfg, EzConfirm) {
    var self = this;

    this.data = {
        "Items":{
            }
    };

    this.getData = function() {
        var url = appCfg.AppPrefix + "/settings/view";

        $http.get(url).success(function(data, status, headers, config) {
                if($filter("CheckError")(data)){
                    var temp = angular.fromJson(data.Data);
                    for(var i=1; i<=9;i++){
                        if (angular.isUndefined(temp.rate[i])){
                            temp.rate[i] = 1;
                        }
                        if (angular.isUndefined(temp.symbol[i])){
                            temp.symbol[i] = {
                                "BTC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ETH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "DASH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "LTC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ETC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "XRP": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "BCH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ZEC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "QTUM": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "EOS": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                }
                            };
                        }
                    }
                    self.data.Items = temp;
                }
            }) .error(function(data, status, headers, config) {

            });
    };

    this.save = function(){
        var url = appCfg.AppPrefix + "/settings/edit";
        var post = {"Data":angular.toJson(self.data.Items)};
        $http.post(url, post).success(function(data, status, headers, config) {
            if($filter("CheckError")(data)){
                EzConfirm.create({heading: '系统提示', text: "操作成功", cancelBtn:'',confirmBtn:'知道了'});
            }
        });
    }


    this.getData();
}]);


;
app.service('SymbolService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
    var self = this;

    this.data = {
        "Items":[]
    };

    this.getData = function() {
        var url = appCfg.AppPrefix + "/apppub/symbol";

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


;
app.service("WebsocketService", ["$rootScope", "$filter", function($rootScope, $filter) {

	var Service = {};
    var ws = null;
	var conn = false;
	var reconn = false;

	setTimeout(function () {
		console.log("开始连接");
    	//默认连接服务器
		connectServer();
    }, 1000);




	function connectServer(){
	 	ws = new WebSocket("ws://" + weburl + "/depth/join");
	 	ws.onopen = function(){
			//通知roomCtrl，可以进行登录 
			conn = true;
	    };
	    
	    ws.onclose = function () {
			$filter("AlertError")("与服务器断开连接，尝试刷新页面重新连接");
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
			"Proto":10002,
			"Content":angular.toJson({"ChatType":type, "ToUserId":tuid,"Content":content})
	  	};
	 	sendRequest(request);
	  
    };


	//返回对象
    return Service;
}])
