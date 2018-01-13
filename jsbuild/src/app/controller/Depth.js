app.controller("DepthCtrl", ["$scope", "$http", "$filter", "$modal", "EzConfirm", "appCfg", "configService",  "$timeout", "WebsocketService",  function ($scope, $http, $filter, $modal, EzConfirm, appCfg, configService, $timeout, WebsocketService) {
	$scope.platform = {"huobi":"火币网", "bithumb":"韩币网"};
	$scope.depth = {
		"BTC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"ETH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"DASH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"LTC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"ETC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"XRP":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"BCH":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"ZEC":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"QTUM":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},

		},
		"EOS":{
			"huobi":{"platform":"huobi", "bids":0, "asks":0,"_bids":0, "_asks":0},
			"bithumb":{"platform":"bithumb","bids":0, "asks":0,"_bids":0, "_asks":0},
		}

	};

	$scope.profit = {
		"BTC":{"percent":0, "money":0},
		"ETH":{"percent":0, "money":0},
		"DASH":{"percent":0, "money":0},
		"LTC":{"percent":0, "money":0},
		"ETC":{"percent":0, "money":0},
		"XRP":{"percent":0, "money":0},
		"BCH":{"percent":0, "money":0},
		"ZEC":{"percent":0, "money":0},
		"QTUM":{"percent":0, "money":0},
		"EOS":{"percent":0, "money":0},
	};
	$scope.amount = 1;
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
				var surplus_percent = ((bithumb_asks - huobi_bids  ) / huobi_bids) * 100;
				var surplus_money = (bithumb_asks - huobi_bids ) * $scope.amount;

				var deficit_percent = ((huobi_asks - bithumb_bids  ) / bithumb_bids) * 100;
				var deficit_money = (huobi_asks - bithumb_bids ) * $scope.amount;
				var type = "surplus";
				if (surplus_percent > deficit_percent) {
					$scope.profit[obj.symbol]['percent'] = surplus_percent;
					$scope.profit[obj.symbol]['money'] = surplus_money;

				}else{
					$scope.profit[obj.symbol]['percent'] = deficit_percent;
					$scope.profit[obj.symbol]['money'] = deficit_money;
					type = "deficit";
				}



				if ($scope.profit[obj.symbol]['percent'] > $scope.percent) {

					var msg = (type=='surplus') ? "A-B" : + "B-A" ;
					msg += " 盈利:" + $scope.profit[obj.symbol]['money'];
					$scope.message.unshift(msg);
				}
			}

			$scope.$apply()



	});

}]);