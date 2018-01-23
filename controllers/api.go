package controllers

import (
	"Deal/models"
	_ "fmt"

	_ "github.com/astaxie/beego"
)

type ApiController struct {
	BaseController
}

//类似构造函数
func (this *ApiController) Prepare() {
	this.CheckPermission()
}

//获取资产信息
func (this *ApiController) Balance() {
	//db := tsDb.NewDbBase()

	oHuobi := models.Huobi{}
	huobi_trade, huobi_frozen := oHuobi.GetBalance()

	oBithumb := models.Bithumb{}
	bithumb_trade, bithumb_frozen := oBithumb.GetBalance()

	this.Code = 1
	this.Result = map[string]interface{}{"HuobiTrade": huobi_trade, "HuobiFrozen": huobi_frozen, "BithumbTrade": bithumb_trade, "BithumbFrozen": bithumb_frozen}
	this.TraceJson()
}
