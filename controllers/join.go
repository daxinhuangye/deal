package controllers

import (
	"Deal/models"
	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
	"net/http"
)

// WebSocketController handles WebSocket requests.
type JoinController struct {
	BaseController
}

//类似构造函数
func (this *JoinController) Prepare() {
	//权限判断
	this.CheckLogin()
}

// Join method handles WebSocket requests for WebSocketController.
func (this *JoinController) Get() {

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

	// Join chat room.
	Join(this.AdminId, ws)
	defer Leave(this.AdminId)

	// Message receive loop.
	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			return
		}
		beego.Info("uid:", this.AdminId, "content:", string(p))
		publish <- newEvent(models.EVENT_MESSAGE, this.AdminId, string(p))
	}
	return
}
