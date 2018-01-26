package controllers

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"net/http"
	"strings"
	"time"
	"tsEngine/tsDb"

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

//开启实时行情
func (this *DepthController) Start() {

	//state := service.GetDepthState()
	//beego.Trace(state)
	//this.Ctx.WriteString("44444444")
	db := tsDb.NewDbBase()
	oSymbol := models.Symbol{}
	symbol_list, _ := db.DbList(&oSymbol)

	for _, v := range symbol_list {
		go GetDepth("huobi", v["Symbol"].(string))
		go GetDepth("bithumb", v["Symbol"].(string))
	}

	this.Ctx.WriteString("44444444")
}

//关闭实时行情
func (this *DepthController) End() {

	state := service.GetDepthState()
	beego.Trace(state)
	this.Ctx.WriteString("44444444")
	db := tsDb.NewDbBase()
	oSymbol := models.Symbol{}
	symbol_list, _ := db.DbList(&oSymbol)

	for _, v := range symbol_list {
		go GetDepth("huobi", v["Symbol"].(string))
		go GetDepth("bithumb", v["Symbol"].(string))
	}

	this.Ctx.WriteString("44444444")
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
	return
}

func GetDepth(platform string, symbol string) {
	huobi_rate, _ := beego.AppConfig.Float("HuobiRate")
	bithumb_rate, _ := beego.AppConfig.Float("BithumbRate")
	switch platform {
	case "huobi":
		obj := models.Huobi{}
		_symbol := strings.ToLower(symbol) + "usdt"
		for {
			if !service.GetDepthState() {
				return
			}
			bids, asks, timestamp := obj.Depth(_symbol, 0)

			if bids != 0 && asks != 0 {

				_bids := bids * huobi_rate
				_asks := asks * huobi_rate
				data := fmt.Sprintf(`{"symbol":"%s", "platform":1, "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, bids, asks, _bids, _asks, timestamp)
				service.Publish(0, data)
			}

			time.Sleep(100 * time.Millisecond)
		}

	case "bithumb":
		obj := models.Bithumb{}
		for {
			if !service.GetDepthState() {
				return
			}
			bids, asks, timestamp := obj.Depth(symbol, 0)

			if bids != 0 && asks != 0 {
				_bids := bids * bithumb_rate
				_asks := asks * bithumb_rate
				data := fmt.Sprintf(`{"symbol":"%s", "platform":2, "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, bids, asks, _bids, _asks, timestamp)
				service.Publish(0, data)
			}
			time.Sleep(100 * time.Millisecond)

		}
	}

}
