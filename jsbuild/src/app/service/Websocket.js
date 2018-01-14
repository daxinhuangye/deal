app.service('WebsocketService', ['$rootScope','LoginService', function($rootScope, LoginService) {
    var proto = {
		"EReqLogin":10001, 		// 登录
		"EResLogin":20001,
		"EReqJionRoom":10002, 	// 加入房间
		"EResJionRoom":20002,
		"EReqLeaveRoom":10003, 	// 离开房间
		"EResLeaveRoom":20003,
		"EReqChat":10004, 		// 聊天
		"EResChat":20004,
		"EReqRoomList":10005, 	// 房间列表
		"EResRoomList":20005,
		"EReqAddRoom":10006, 	// 添加房间
		"EResAddRoom":20006,
		"EReqDelRoom":10007, 	// 删除房间
		"EResDelRoom":20007,
		"EReqUpRoom":10008, 	// 更新房间
		"EResUpRoom":20008,
		"EReqRoomUserList":10009, // 获得房间用户列表
		"EResRoomUserList":20009,
		"EReqUseItem":10011,		//使用道具
		"EResUseItem":20011,			//使用道具返回
		"EReqFriendList":10013,		//获取好友在线信息
		"EResFriendList":20013		//好友在线信息返回


	};
	
	var Service = {};
 
    var ws = null;
	var conn = false;
	var reconn = false;
	
	//默认连接服务器
	connectServer();
   

	function connectServer(){
	 	ws = new WebSocket("ws://" + weburl + "/depth/join");
	 	ws.onopen = function(){
			//通知roomCtrl，可以进行登录 
			conn = true;
	    };
	    
	    ws.onclose = function () {
			console.log("连接关闭");
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
			"Proto":proto.EReqChat,
			"Content":angular.toJson({"ChatType":type, "ToUserId":tuid,"Content":content})
	  	};
	 	sendRequest(request);
	  
    };



	//返回对象
    return Service;
}])
