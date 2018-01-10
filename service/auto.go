package service

import (
	"Deal/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"math"
	"tsEngine/tsDb"
	"tsEngine/tsMail"
)

type Auto struct {
	working      bool
	platformList []orm.Params
	symbolList   []orm.Params
	settingList  []orm.Params
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

		//链接数据库
		db := tsDb.NewDbBase()
		//载入平台列表
		oPlatform := models.Platform{}
		this.platformList, _ = db.DbList(&oPlatform)
		if len(this.platformList) == 0 {
			beego.Error("平台配置错误")
			return
		}

		//载入币种列表
		oSymbol := models.Symbol{}
		this.symbolList, _ = db.DbList(&oSymbol, "State", 1)

		if len(this.symbolList) == 0 {
			beego.Error("币种配置错误")
			return
		}

		//获取币种列表
		oSettings := models.Settings{}
		this.settingList, _ = db.DbList(&oSettings)

		if len(this.settingList) == 0 {
			beego.Error("配置错误")
			return
		}

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

func (this *Auto) getSetting(pid, sid int64) orm.Params {
	//获取配置信息
	for _, v := range this.settingList {
		if v["Pid"].(int64) == pid && v["Sid"].(int64) == sid {
			return v
		}
	}
	return nil
}

//盈利计算
func (this *Auto) getProfit(buy, rate_1, sell, rate_2, deal_cost, payment float64) (float64, float64) {

	buy_cny := buy * rate_1
	sell_cny := sell * rate_2
	//lirun := sell_cny - buy_cny - "平台交易费" - "平台币种转账费"
	lirun := sell_cny - buy_cny //- deal_cost - payment
	rate := (lirun / buy_cny) * 100
	return rate, lirun
}

//自动交易AI
func (this *Auto) goAI() {
	//交易停止发送邮件
	defer this.sendMail()

	//创建火币网对象
	oHuobi := models.Huobi{}
	//创建韩国交易平台对象
	oBithumb := models.Bithumb{}

	for _, v := range this.platformList {
		switch v["Platform"].(string) {
		case "huobi":
			//设置汇率
			oHuobi.Rate = v["Rate"].(float64)
		case "bithumb":
			//设置汇率
			oBithumb.Rate = v["Rate"].(float64)
		}

	}

	//启动前先检测是否有没有完成的交易

	symbols := oHuobi.GetSymbols()
	beego.Trace("币种", symbols)

	//获取个人资产
	balance := oHuobi.GetBalance()
	beego.Trace("火币网资产：", balance)
	//orders := oHuobi.GetOrders("xrpusdt", "", "", "", "submitted", "", "", "")
	//beego.Trace("交易列表：", orders)

	//自动交易AI
	//this.working = false
	for {
		if this.working {

			//循环币种
			for _, v := range this.symbolList {
				//获取火币网配置信息
				huobi_settings := this.getSetting(1, v["Id"].(int64))
				//获取火币网行情
				huobi_buy, huobi_sell := oHuobi.Depth(v["Huobi"].(string), v["Amount"].(float64))

				//获取韩币网配置信息
				bithumb_settings := this.getSetting(1, v["Id"].(int64))
				//获取韩币网行情
				bithumb_buy, bithumb_sell := oBithumb.Depth(v["Bithumb"].(string), v["Amount"].(float64))

				//有任何一个数据没有获得，表示有问题放弃交易
				if huobi_buy == 0 || huobi_sell == 0 || bithumb_buy == 0 || bithumb_sell == 0 {
					continue
				}
				//从A买入卖到B的盈利百分比
				zhang1, money1 := this.getProfit(huobi_buy, oHuobi.Rate, bithumb_sell, oBithumb.Rate, huobi_settings["DealCost"].(float64), huobi_settings["Payment"].(float64))
				beego.Trace("火币网买入韩国卖赢利：", zhang1, "挣了多少：", money1)

				//从B买入卖到A的盈利百分比
				zhang2, money2 := this.getProfit(bithumb_buy, oBithumb.Rate, huobi_sell, oHuobi.Rate, bithumb_settings["DealCost"].(float64), bithumb_settings["Payment"].(float64))

				beego.Trace("韩国买入火币网卖赢利：", zhang2, "挣了多少：", money2)
				//如果A涨幅规则匹配
				if int64(math.Ceil(zhang1)) >= v["Surplus"].(int64) {
					beego.Trace("开始下单")
					//在A下单
					huobi_buy = huobi_buy - 1
					order_id := oHuobi.CreateOrder(beego.AppConfig.String("HuobiAccountId"), huobi_buy, v["Amount"].(float64), v["Huobi"].(string), "buy-limit", huobi_settings["PricePrecision"].(int64), huobi_settings["AmountPrecision"].(int64))
					if order_id == "" {
						beego.Error("下单失败，进行下个币种的交易逻辑")
						continue
					}
					beego.Trace(order_id)
					//撤销订单
					res := oHuobi.CancelOrder(order_id)
					beego.Trace("取消订单：", res)
					//监视订单是否成交
					if oHuobi.OrderDeal(order_id) {
						//如果A站成交，B站开始交易

					}
					beego.Trace("下单结束")
					//停止交易
					this.Stop()
					/*
						if order_id == "" {
							beego.Error("下单失败，进行下个币种的交易逻辑")
							continue
						}

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
