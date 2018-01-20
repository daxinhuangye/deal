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
			//如果数量小于等于0 或者 买盘和卖盘都相等的话，直接返回
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