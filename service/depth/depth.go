package depth

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"time"
	"tsEngine/tsDb"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

type Subdepth struct {
	Platform int
	Symbol   string
	Currency string
}

var symbolData []orm.Params

var (
	symbolManage = make(map[string]string)

	depthChan = make(chan Subdepth, 20)

	msgTemplate = `{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`
)

//开启实时行情
func DepthRun() {
	beego.Trace("行情开启")
	go listionDepthChan()
	for _, v := range symbolData {

		go pushDepthChan(2, v["Symbol"].(string), v["Bithumb"].(string))
		go pushDepthChan(4, v["Symbol"].(string), v["Coinone"].(string))
		go pushDepthChan(5, v["Symbol"].(string), v["Korbit"].(string))
		go pushDepthChan(6, v["Symbol"].(string), v["Coinnest"].(string))
		go pushDepthChan(7, v["Symbol"].(string), v["Gate"].(string))
		go pushDepthChan(8, v["Symbol"].(string), v["Okex"].(string))

	}
}

func pushDepthChan(platform int, symbol, currency string) {
	if currency != "" {
		depthChan <- Subdepth{Platform: platform, Symbol: symbol, Currency: currency}
	}
}

func getDepthData(platform int, symbol, currency string) {
	bids, asks, ts := float64(0), float64(0), int64(0)

	switch platform {

	case 2:
		obj := models.Bithumb{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Bithumb", symbol)

	case 4:
		obj := models.Coinone{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Coinone", symbol)

	case 5:
		obj := models.Korbit{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Korbit", symbol)

	case 6:
		obj := models.Coinnest{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Coinnest", symbol)

	case 7:
		obj := models.Gate{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Gate", symbol)

	case 8:
		obj := models.Okex{}
		bids, asks, ts = obj.Depth(currency, 0)
		beego.Trace("触发:Okex", symbol)
	default:
	}

	if bids != 0 && asks != 0 {
		beego.Trace(bids, asks, ts)
		data := fmt.Sprintf(msgTemplate, symbol, platform, bids, asks, ts)
		service.Publish(0, data)
		go pushDepthChan(platform, symbol, currency)
	}

}
func listionDepthChan() {

	for {

		select {

		case sub := <-depthChan:
			go getDepthData(sub.Platform, sub.Symbol, sub.Currency)
		default:
		}
		//必须加入时间片
		time.Sleep(500 * time.Millisecond)

	}
}

//获取币种信息
func GetSymbol() {
	db := tsDb.NewDbBase()
	oSymbol := models.Symbol{}
	symbolData, _ = db.DbList(&oSymbol)
	beego.Trace("币种获取完毕")

}
