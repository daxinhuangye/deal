package controllers

import (
	"Deal/models"
	_ "fmt"

	_ "github.com/astaxie/beego"
	"github.com/tidwall/gjson"
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

//获取资产信息
func (this *ApiController) Symbols() {
	//db := tsDb.NewDbBase()

	oHuobi := models.Huobi{}
	content := oHuobi.GetSymbols()
	data := gjson.Get(content, "data").Array()
	price := make(map[string]int64)
	amount := make(map[string]int64)
	for _, v := range data {
		if v.Get("quote-currency").String() == "usdt" {
			key := v.Get("base-currency").String()
			price[key] = v.Get("price-precision").Int()
			amount[key] = v.Get("amount-precision").Int()
		}
	}
	this.Code = 1
	this.Result = map[string]interface{}{"Price": price, "Amount": amount}

	this.TraceJson()
}
