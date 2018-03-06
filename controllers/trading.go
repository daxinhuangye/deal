package controllers

import (
	"Deal/models"

	_ "fmt"

	"github.com/astaxie/beego"

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
	o := models.Trading{}
	o.Symbol = this.GetString("symbol")
	o.Period = this.GetString("period")

	Page := int64(1) //this.GetInt64("Page")
	PageSize, _ := this.GetInt64("size")

	items, _, err := o.List(Page, PageSize)

	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "数据库异常错误，请联系管理员"
		this.TraceJson()
	}

	ts := tsTime.CurrMs()
	this.Code = 1
	this.Result = map[string]interface{}{"symbol": o.Symbol, "timestamp": ts, "data": items}
	this.TraceJson()

}
