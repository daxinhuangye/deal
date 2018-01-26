package controllers

import (
	"Deal/models"
	_ "fmt"
	"tsEngine/tsDb"

	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/tidwall/gjson"
)

type ApiController struct {
	BaseController
	Secret []orm.Params
}

//类似构造函数
func (this *ApiController) Prepare() {
	//权限检查
	this.CheckPermission()

	oSecret := models.Secret{}

	db := tsDb.NewDbBase()
	this.Secret, _ = db.DbList(oSecret, "Uid", this.AdminId)

}

//获取秘要数据
func (this *ApiController) getSecret(pid int64) (string, string) {
	for _, v := range this.Secret {
		if v["Pid"].(int64) == pid {
			return v["AccessKey"].(string), v["SecretKey"].(string)
		}
	}
	return "", ""
}

//获取币种配置信息
func (this *ApiController) Symbols() {
	//获取密钥数据
	access, secret := this.getSecret(1)
	beego.Trace(access, secret)
	oHuobi := models.Huobi{}
	oHuobi.AccessKey = access
	oHuobi.SecretKey = secret

	content := oHuobi.GetSymbols()
	data := gjson.Get(content, "data").Array()
	price := make(map[string]int64)
	amount := make(map[string]int64)
	for _, v := range data {
		if v.Get("quote-currency").String() == "usdt" {
			key := strings.ToUpper(v.Get("base-currency").String())
			price[key] = v.Get("price-precision").Int()
			amount[key] = v.Get("amount-precision").Int()
		}
	}
	this.Code = 1
	this.Result = map[string]interface{}{"Price": price, "Amount": amount}

	this.TraceJson()
}

//获取资产信息
func (this *ApiController) Balance() {
	//获取密钥数据
	access, secret := this.getSecret(1)
	oHuobi := models.Huobi{}
	oHuobi.AccessKey = access
	oHuobi.SecretKey = secret

	huobi_trade, huobi_frozen := oHuobi.GetBalance()

	//获取密钥数据
	access, secret = this.getSecret(2)
	oBithumb := models.Bithumb{}
	oBithumb.AccessKey = access
	oBithumb.SecretKey = secret

	bithumb_trade, bithumb_frozen := oBithumb.GetBalance()

	this.Code = 1
	this.Result = map[string]interface{}{"HuobiTrade": huobi_trade, "HuobiFrozen": huobi_frozen, "BithumbTrade": bithumb_trade, "BithumbFrozen": bithumb_frozen}
	this.TraceJson()
}

//创建下单
func (this *ApiController) CreateOrder() {

}

//取消定单
func (this *ApiController) CencelOrder() {

}

//取消定单
func (this *ApiController) GetRate() {
	oHuobi := models.Huobi{}
	rate := oHuobi.GetRate()
	beego.Trace(rate)
	this.Ctx.WriteString("111")
}
