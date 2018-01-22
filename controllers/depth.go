package controllers

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"net/http"
	"strings"
	"time"
	"tsEngine/tsDb"
	"tsEngine/tsTime"

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
	//depth := make(map[string]string)
	switch platform {
	case "huobi":
		obj := models.Huobi{}
		_symbol := strings.ToLower(symbol) + "usdt"
		for {
			if !service.GetDepthState() {
				return
			}
			buy, sell := obj.Depth(_symbol, 0)
			//key := fmt.Sprintf("huobi_%s", symbol)
			//value := fmt.Sprintf("%f_%f", buy, sell)
			//if buy != 0 && sell != 0 && depth[key] != value {
			if buy != 0 && sell != 0 {
				//depth[key] = value
				_buy := buy * 7
				_sell := sell * 7
				timestamp := tsTime.CurrSe()
				data := fmt.Sprintf(`{"symbol":"%s", "platform":1, "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, buy, sell, _buy, _sell, timestamp)

				service.Publish(0, data)
			}

			time.Sleep(1 * time.Second)
		}

	case "bithumb":
		obj := models.Bithumb{}
		for {
			if !service.GetDepthState() {
				return
			}
			buy, sell := obj.Depth(symbol, 0)
			//key := fmt.Sprintf("bithumb_%s", symbol)
			//value := fmt.Sprintf("%f_%f", buy, sell)
			//if buy != 0 && sell != 0 && depth[key] != value {
			if buy != 0 && sell != 0 {
				//depth[key] = value
				_buy := buy * 0.006
				_sell := sell * 0.006
				timestamp := tsTime.CurrSe()
				data := fmt.Sprintf(`{"symbol":"%s", "platform":2, "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, buy, sell, _buy, _sell, timestamp)
				service.Publish(0, data)
			}
			time.Sleep(1 * time.Second)

		}
	}

}
