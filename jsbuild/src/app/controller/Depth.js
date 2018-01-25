app.controller("DepthCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "PlatformService",  "$timeout", "WebsocketService","BalanceService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, PlatformService, $timeout, WebsocketService, BalanceService) {
    $scope.height = $scope.windowHeight - 100;

	//平台数据
	$scope.platform = PlatformService.data;
	//资产状态
	$scope.balance = BalanceService.data;
	//更新资产状况
    $scope.getBalance = function(){
        BalanceService.getData();
    };

	$scope.tab = 0;
	$scope.active = function(tab) {
        $scope.tab = tab;
	};
	//行情数据
	$scope.depth = {
		"BTC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ETH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"DASH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"LTC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ETC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"XRP":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"BCH":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"ZEC":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"QTUM":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		},
		"EOS":{
			"1":{"platform":1, "bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
			"2":{"platform":2,"bids":0, "asks":0,"_bids":0, "_asks":0, "time":0},
		}
	};
	//盈利数据
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

	//下拉配置
	$scope.select = {
		"mode":[{"Id":0, "Name":"买卖"}, {"Id":1, "Name":"卖买"}, {"Id":2, "Name":"同时"}],
		"order":[{"Id":0, "Name":"手动"}, {"Id":1, "Name":"自动"}],
		"type":[{"Id":0, "Name":"顺差"}, {"Id":1, "Name":"逆差"}],
	};
	$scope.precision = 
	//参数配置
	$scope.settings = {
		"rate" : {"1": 7, "2":0.006},
		"surplus" : 15,
		"deficit" : 5,
		"mode":0,
		"order":0,
		"symbol":{
			"BTC":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"ETH":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"DASH":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"LTC":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"ETC":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"XRP":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"BCH":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"ZEC":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"QTUM":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
			"EOS":{"amount":10, "fee":{"1":[0.2, 0.001], "2":[0.2, 0.001]}, "color":false},
		},


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
        var data = {"symbol":symbol, "surplus":surplus, "deficit":deficit, "_deficit":Math.abs(deficit) };
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
			"mode":$scope.settings.mode,
			"buy":$scope.depth[symbol]['1']['_bids'],
			"sell":$scope.depth[symbol]['2']['_asks'],
			"amount": $scope.settings.symbol[symbol].amount,
			"percent":$scope.profit[symbol]["surplus"]['percent'],
			"money":$scope.profit[symbol]["surplus"]['money'],
			"type":0
		};

		if (type == 1) {
			data['buy'] = $scope.depth[symbol]['2']['_bids'];
			data['sell'] = $scope.depth[symbol]['1']['_asks'];
			data['percent'] = $scope.profit[symbol]["deficit"]['percent'];
			data['money'] = $scope.profit[symbol]["deficit"]['money'];
			data['type'] = 1;
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
			if ($scope.settings.symbol[obj.symbol].amount<=0 || (obj.bids == $scope.depth[obj.symbol][obj.platform].bids && obj.asks == $scope.depth[obj.symbol][obj.platform].asks) ){
				return
			}
			$scope.depth[obj.symbol][obj.platform] = obj;
			$scope.depth[obj.symbol][obj.platform]._asks =  $scope.depth[obj.symbol][obj.platform].asks * $scope.settings.rate[obj.platform];
			$scope.depth[obj.symbol][obj.platform]._bids =  $scope.depth[obj.symbol][obj.platform].bids * $scope.settings.rate[obj.platform];

			var huobi_bids = $scope.depth[obj.symbol]['1']['_bids'];
			var huobi_asks = $scope.depth[obj.symbol]['1']['_asks'];

			var bithumb_bids = $scope.depth[obj.symbol]['2']['_bids'];
			var bithumb_asks = $scope.depth[obj.symbol]['2']['_asks'];



			if(huobi_bids!=0 && huobi_bids !=0 && bithumb_bids!=0 && bithumb_asks!=0){
				$scope.settings.symbol[obj.symbol].color = true;
				$timeout(function(){
					$scope.settings.symbol[obj.symbol].color = false;
					//return
				},1000);
				//顺差计算
				$scope.profit[obj.symbol]["surplus"]['percent'] = ((bithumb_asks - huobi_bids  ) / huobi_bids) * 100;
				$scope.profit[obj.symbol]["surplus"]['money'] = (bithumb_asks - huobi_bids ) * $scope.settings.symbol[obj.symbol].amount;
				//逆差计算
				$scope.profit[obj.symbol]["deficit"]['percent'] = ((huobi_asks - bithumb_bids  ) / bithumb_bids) * 100;
				$scope.profit[obj.symbol]["deficit"]['money'] = (huobi_asks - bithumb_bids ) * $scope.settings.symbol[obj.symbol].amount;

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
                    "mode":$scope.settings.mode,
                    "buy":huobi_bids,
                    "sell":bithumb_asks,
                    "amount": $scope.settings.symbol[obj.symbol].amount,
                    "percent":$scope.profit[obj.symbol]["surplus"]['percent'],
                    "money":$scope.profit[obj.symbol]["surplus"]['money'],
                    "type":0
                };

                if ($scope.profit[obj.symbol]["deficit"]['percent'] >= $scope["settings"].deficit) {
                    data['buy'] = bithumb_bids;
                    data['sell'] = huobi_asks;
                    data['percent'] = $scope.profit[obj.symbol]["deficit"]['percent'];
                    data['money'] = $scope.profit[obj.symbol]["deficit"]['money'];
                    data['type'] = 1;
                }
                //添加到消息队列
                $scope.message.push(data);
			}

			$scope.$apply()



	});

}]);