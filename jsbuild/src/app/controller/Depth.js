app.controller("DepthCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "PlatformService",  "$timeout", "WebsocketService","BalanceService", "SettingsService","OrderService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, PlatformService, $timeout, WebsocketService, BalanceService, SettingsService, OrderService) {
    $scope.height = $scope.windowHeight - 100;

	//平台数据
	$scope.platform = PlatformService.data;
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
	//行情数据
	$scope.depth = {
		"BTC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ETH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"DASH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"LTC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ETC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"XRP":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"BCH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ZEC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"QTUM":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"EOS":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"3":{"platform":3,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		}
	};
	//盈利数据
	$scope.profit = {
		"BTC":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"ETH":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"DASH":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"LTC":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"ETC":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"XRP":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"BCH":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"ZEC":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"QTUM":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
		"EOS":{"surplus":{"percent":0, "money":0, "formula":""}, "deficit":{"percent":0, "money":0, "formula":""}},
	};

	//下拉配置
	$scope.select = {
		"mode":[{"Id":1, "Name":"买卖"}, {"Id":2, "Name":"卖买"}, {"Id":3, "Name":"同时"}],
		"order":[{"Id":1, "Name":"手动"}, {"Id":2, "Name":"自动"}],
		"type":[{"Id":1, "Name":"顺差"}, {"Id":2, "Name":"逆差"}],
	};
	//$scope.precision = 
	//参数配置
	$scope.settings = SettingsService.data;

	$scope.settingsSave = function(){
		//console.log($scope.settings.Items);
		SettingsService.save($scope.settings.Items);
	};
	//差值排序
	$scope.sortList = [];
	$scope.upSort = function(symbol, surplus, deficit ){
        var key=-1;
		for (var i=0; i<$scope.sortList.length; i++) {
            if ($scope.sortList[i].symbol == symbol) {
            	key = i;
            	break;
            }
        }
        var data = {"symbol":symbol, "surplus":surplus, "deficit":deficit};
        if(key>=0){
            $scope.sortList[key] = data;
		}else{
            $scope.sortList.push(data)
		}

	};
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

		//如果数量小于等于0 或者 买盘和卖盘都相等的话，直接返回
		if ($scope.settings.Items.symbol[obj.symbol].amount<=0 || (obj.bids == $scope.depth[obj.symbol][obj.platform].bids && obj.asks == $scope.depth[obj.symbol][obj.platform].asks) ){
			return
		}

		
		$scope.depth[obj.symbol][obj.platform] = obj;
		$scope.depth[obj.symbol][obj.platform]._bids =  $scope.depth[obj.symbol][obj.platform].bids * $scope.settings.Items.rate[obj.platform];
		$scope.depth[obj.symbol][obj.platform]._asks =  $scope.depth[obj.symbol][obj.platform].asks * $scope.settings.Items.rate[obj.platform];
		
		for (i in $scope.depth[obj.symbol] ) {

			for (i in $scope.depth[obj.symbol] ) {
				//console.log( $scope.depth[obj.symbol][i]);
			}
		}
		var huobi_bids = $scope.depth[obj.symbol]['1']['_bids'];
		var huobi_asks = $scope.depth[obj.symbol]['1']['_asks'];

		var bithumb_bids = $scope.depth[obj.symbol]['2']['_bids'];
		var bithumb_asks = $scope.depth[obj.symbol]['2']['_asks'];

		var huobi_bids_total = huobi_bids * $scope.settings.Items.symbol[obj.symbol].amount;
		var huobi_asks_total = huobi_asks * $scope.settings.Items.symbol[obj.symbol].amount;
		var bithumb_bids_total = bithumb_bids * $scope.settings.Items.symbol[obj.symbol].amount;
		var bithumb_asks_total = bithumb_asks * $scope.settings.Items.symbol[obj.symbol].amount;

		//计算交易费
		var huobi_bids_fee = huobi_bids_total * ($scope.settings.Items.symbol[obj.symbol].fee["1"][0] / 100);
		var huobi_asks_fee = huobi_asks_total * ($scope.settings.Items.symbol[obj.symbol].fee["1"][0] / 100);
		var bithumb_bids_fee = bithumb_bids_total *($scope.settings.Items.symbol[obj.symbol].fee["2"][0] / 100);
		var bithumb_asks_fee = bithumb_asks_total * ($scope.settings.Items.symbol[obj.symbol].fee["2"][0] / 100);

		//计算转账费
		var huobi_transfer = huobi_asks * $scope.settings.Items.symbol[obj.symbol].fee["1"][1];
		var bithumb_transfer = bithumb_asks * $scope.settings.Items.symbol[obj.symbol].fee["2"][1];

		if(huobi_bids!=0 && huobi_bids !=0 && bithumb_bids!=0 && bithumb_asks!=0){
				$scope.settings.Items.symbol[obj.symbol].color = true;
				$timeout(function(){
					$scope.settings.Items.symbol[obj.symbol].color = false;
					//return
				},1000);

				//顺差计算
				$scope.profit[obj.symbol]["surplus"]['money'] = bithumb_bids_total - huobi_asks_total - bithumb_bids_fee - huobi_asks_fee - huobi_transfer;
				$scope.profit[obj.symbol]["surplus"]['percent'] = ($scope.profit[obj.symbol]["surplus"]['money'] / huobi_asks_total) * 100;
				$scope.profit[obj.symbol]["surplus"]['formula'] = bithumb_bids_total +"-"+ huobi_asks_total +"-"+ bithumb_bids_fee +"-"+ huobi_asks_fee +"-"+ huobi_transfer;
				//逆差计算
				$scope.profit[obj.symbol]["deficit"]['money'] = huobi_bids_total - bithumb_asks_total - huobi_bids_fee - bithumb_asks_fee - bithumb_transfer ;
				$scope.profit[obj.symbol]["deficit"]['percent'] = ($scope.profit[obj.symbol]["deficit"]['money'] / bithumb_asks_total) * 100;
				$scope.profit[obj.symbol]["deficit"]['formula'] = huobi_bids_total +"-"+ bithumb_asks_total +"-"+ huobi_bids_fee +"-"+ bithumb_asks_fee +"-"+ bithumb_transfer ;
				//放入排序队列
                $scope.upSort(obj.symbol, $scope.profit[obj.symbol]["surplus"]['percent'], $scope.profit[obj.symbol]["deficit"]['percent']);

				//如果顺差和逆差都不满足条件直接返回
                if ($scope.profit[obj.symbol]["surplus"]['percent'] < $scope["settings"].surplus &&  $scope.profit[obj.symbol]["deficit"]['percent'] < $scope["settings"].surplus){
                    return
                }

                //默认是顺差数据
                var data = {
	                "index":index++,
                    "symbol":obj.symbol,
                    "mode":$scope.settings.Items.mode,
                    "buy":huobi_asks,
                    "sell":bithumb_bids,
                    "amount": $scope.settings.Items.symbol[obj.symbol].amount,
                    "percent":$scope.profit[obj.symbol]["surplus"]['percent'],
                    "money":$scope.profit[obj.symbol]["surplus"]['money'],
                    "type":1
                };

                if ($scope.profit[obj.symbol]["deficit"]['percent'] >= $scope["settings"].deficit) {
                    data['buy'] = bithumb_asks;
                    data['sell'] = huobi_bids;
                    data['percent'] = $scope.profit[obj.symbol]["deficit"]['percent'];
                    data['money'] = $scope.profit[obj.symbol]["deficit"]['money'];
                    data['type'] = 2;
                }
                //添加到消息队列
                //$scope.message.push(data);
			}

			$scope.$apply()



	});

}]);