
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
