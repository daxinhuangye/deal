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

	////fee 币种的数量；cost 交易费：每一单总价的 XXX%；
	$scope.settings = {
		"BTC":{"amount":1, "fee":0, "cost":0},
		"ETH":{"amount":1, "fee":0, "cost":0},
		"DASH":{"amount":1, "fee":0, "cost":0},
		"LTC":{"amount":1, "fee":0, "cost":0},
		"ETC":{"amount":1, "fee":0, "cost":0},
		"XRP":{"amount":1, "fee":0, "cost":0},
		"BCH":{"amount":1, "fee":0, "cost":0},
		"ZEC":{"amount":1, "fee":0, "cost":0},
		"QTUM":{"amount":1, "fee":0, "cost":0},
		"EOS":{"amount":1, "fee":0, "cost":0},
	};

	$scope.percent = 25;
	$scope.message = [];
	$scope.$on('10000', function(event, data) {

			var obj = angular.fromJson(data);
			$scope.depth[obj.symbol][obj.platform] = obj;

			var huobi_bids = $scope.depth[obj.symbol]['huobi']['_bids'];
			var huobi_asks = $scope.depth[obj.symbol]['huobi']['_asks'];

			var bithumb_bids = $scope.depth[obj.symbol]['bithumb']['_bids'];
			var bithumb_asks = $scope.depth[obj.symbol]['bithumb']['_asks'];



			if(huobi_bids!=0 && huobi_bids !=0 && bithumb_bids!=0 && bithumb_asks!=0){
				//顺差计算
				$scope.profit[obj.symbol]["surplus"]['percent'] = ((bithumb_asks - huobi_bids  ) / huobi_bids) * 100;
				$scope.profit[obj.symbol]["surplus"]['money'] = (bithumb_asks - huobi_bids ) * $scope.amount;
				//逆差计算
				$scope.profit[obj.symbol]["deficit"]['percent'] = ((huobi_asks - bithumb_bids  ) / bithumb_bids) * 100;
				$scope.profit[obj.symbol]["deficit"]['money'] = (huobi_asks - bithumb_bids ) * $scope.amount;
				var data = {"mode":"A->B", "buy":huobi_bids, "sell":bithumb_asks, "amount": 0, "percent":0, "money":0 };

				var price = $scope.profit[obj.symbol]["surplus"]['money'];
				var percent = $scope.profit[obj.symbol]["surplus"]['percent'];

				if ($scope.profit[obj.symbol]["surplus"]['percent'] < $scope.profit[obj.symbol]["deficit"]['percent']) {


					price = $scope.profit[obj.symbol]["deficit"]['money'];
					percent = $scope.profit[obj.symbol]["deficit"]['percent'];
					data['mode'] = "B->A";
					data['buy'] = bithumb_bids;
					data['sell'] = huobi_asks;
					data['percent'] = percent;

				}
				data['money'] =  price * $scope.settings[obj.symbol].amount;

				if (percent >= $scope.percent) {
					$scope.message.unshift(data);
				}
					
					
			}

			$scope.$apply()



	});

}]);