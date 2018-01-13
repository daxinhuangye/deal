
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
