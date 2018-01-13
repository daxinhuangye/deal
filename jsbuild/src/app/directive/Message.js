/**
 * Created by Administrator on 2018/1/12.
 */
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