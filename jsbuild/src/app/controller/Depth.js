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