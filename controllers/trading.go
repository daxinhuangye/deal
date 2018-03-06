package controllers

import (
	"Deal/models"

	_ "fmt"
	"tsEngine/tsDb"

	"tsEngine/tsTime"
)

type TradingController struct {
	BaseController
}

//类似构造函数
func (this *TradingController) Prepare() {
	this.CheckPermission()
}

//获取订单列表
func (this *TradingController) List() {
	symbol := this.GetString("symbol")
	period := this.GetString("period")

	db := tsDb.NewDbBase()
	o := models.Trading{}

	order := []string{"tick_id"}

	list, _ := db.DbListOrder(&o, order, "Symbol", symbol, "Period", period)

	ts := tsTime.CurrMs()
	this.Code = 1
	this.Result = map[string]interface{}{"symbol": symbol, "timestamp": ts, "data": list}
	this.TraceJson()

}
