package service

import (
	"Deal/models"
	"github.com/astaxie/beego"
	"math"
	"tsEngine/tsDb"
	"tsEngine/tsMail"
)

type Auto struct {
	working bool
}

var instance *Auto

//获取实例对象
func GetInstance() *Auto {
	if instance == nil {
		instance = &Auto{}
	}
	return instance
}

//开启AI任务
func (this *Auto) Start() {

	if !this.working {
		beego.Trace("开始")
		this.working = true
		go this.goAI()
	}

}

//停止AI任务
func (this *Auto) Stop() {
	beego.Trace("停止")
	this.working = false
}

//自动交易AI
func (this *Auto) sendMail() {

	user := "43943634@qq.com"
	password := "nzyjoxsojksxcbef"
	host := "smtp.qq.com:25"
	to := "43943634@qq.com"
	subject := "交易警报"
	body := "自动交易已经停止运行"
	go tsMail.SendMail(user, password, host, to, subject, body, "text")

}

//盈利计算
func (this *Auto) profit(buy, rate_1, sell, rate_2 float64) float64 {
	beego.Trace("汇率1：", rate_1, "汇率2：", rate_2)
	buy_cny := buy * rate_1
	sell_cny := sell * rate_2
	beego.Trace("买：", buy_cny, "卖：", sell_cny)

	temp := ((sell_cny - buy_cny) / buy_cny) * 100
	return temp
}

//自动交易AI
func (this *Auto) goAI() {
	//交易停止发送邮件
	defer this.sendMail()

	//链接数据库
	db := tsDb.NewDbBase()
	//获取平台列表
	oPlatform := models.Platform{}
	platform_list, _ := db.DbList(&oPlatform)
	if len(platform_list) == 0 {
		beego.Error("平台配置错误")
	}
	//获取币种列表
	oSymbol := models.Symbol{}
	symbol_list, _ := db.DbList(&oSymbol, "State", 1)
	if len(symbol_list) == 0 {
		beego.Error("币种配置错误")
	}

	beego.Trace(symbol_list)

	//创建火币网对象
	oHuobi := models.Huobi{}
	//创建韩国交易平台对象
	oBithumb := models.Bithumb{}

	for _, v := range platform_list {
		switch v["Platform"].(string) {

		case "huobi":
			//设置汇率
			oHuobi.Rate = v["Rate"].(float64)
			//设置手续费
			oHuobi.Fee = v["Fee"].(float64)
		case "bithumb":
			//设置汇率
			oBithumb.Rate = v["Rate"].(float64)
			//设置手续费
			oBithumb.Fee = v["Fee"].(float64)
		}

	}
	//启动前先检测是否有没有完成的交易

	//自动交易AI
	//this.working = false
	for {
		if this.working {

			//循环币种
			for _, v := range symbol_list {
				huobi_buy, huobi_sell := oHuobi.Depth(v["Huobi"].(string), v["Amount"].(float64))
				bithumb_buy, bithumb_sell := oBithumb.Depth(v["Bithumb"].(string), v["Amount"].(float64))
				beego.Trace("韩国：", bithumb_buy, bithumb_sell)
				//有任何一个数据没有获得，表示有问题放弃交易
				if huobi_buy == 0 || huobi_sell == 0 || bithumb_buy == 0 || bithumb_sell == 0 {
					continue
				}
				//从A买入卖到B的盈利百分比
				zhang1 := this.profit(huobi_buy, oHuobi.Rate, bithumb_sell, oBithumb.Rate)

				//从B买入卖到A的盈利百分比
				zhang2 := this.profit(bithumb_buy, oBithumb.Rate, huobi_sell, oHuobi.Rate)
				beego.Trace("涨幅比例：", zhang1, zhang2)
				//如果A涨幅规则匹配
				if int64(math.Ceil(zhang1)) >= v["Surplus"].(int64) {
					//在A下单
					order_id := oHuobi.CreateOrder(beego.AppConfig.String("HuobiAccountId"), v["Amount"].(float64), huobi_buy, v["Huobi"].(string), "buy-limit")

					if order_id == "" {
						beego.Error("下单失败，进行下个币种的交易逻辑")
						continue
					}
					/*
						//监视订单是否成交
						if oHuobi.OrderDeal() {
							//如果A站成交，B站开始交易
						}
					*/
				}
			}

		} else {
			break
		}
	}
}
