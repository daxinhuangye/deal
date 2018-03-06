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
