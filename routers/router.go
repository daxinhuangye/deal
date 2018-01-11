package routers

import (
	"Deal/controllers"

	"github.com/astaxie/beego"
)

func init() {

	beego.Router("/", &controllers.IndexController{})

	beego.AutoRouter(&controllers.IndexController{})
	beego.Router("/join", &controllers.IndexController{}, "post:Join")

	// WebSocket.
	beego.Router("/ws", &controllers.WebSocketController{})
	beego.Router("/ws/join", &controllers.WebSocketController{}, "get:Join")
}
