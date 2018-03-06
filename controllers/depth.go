package controllers

import (
	"Deal/service"

	"net/http"

	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
)

// WebSocketController handles WebSocket requests.
type DepthController struct {
	BaseController
}

//类似构造函数
func (this *DepthController) Prepare() {
	//权限判断
	this.CheckLogin()
}

//链接行情服务
func (this *DepthController) Join() {

	if this.AdminId == 0 {
		this.Redirect("/", 302)
		return
	}

	// Upgrade from http request to WebSocket.
	ws, err := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(this.Ctx.ResponseWriter, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		beego.Error("Cannot setup WebSocket connection:", err)
		return
	}

	//加入房间
	service.Join(this.AdminId, ws)
	//释放函数时离开房间
	defer service.Leave(this.AdminId)

	//等待接受用户的消息
	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			return
		}
		beego.Info("uid:", this.AdminId, "content:", string(p))
		service.Publish(this.AdminId, string(p))
	}
	this.Code = 1
	this.TraceJson()

}
