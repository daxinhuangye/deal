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

	depthChan = make(chan Subdepth)

	msgTemplate = `{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`
)

//开启实时行情
func DepthRun() {
	beego.Trace("行情开启")
	time.Sleep(1000 * time.Millisecond)
	//
	go listionDepthChan()

	for _, v := range symbolData {
		pushDepthChan(2, v["Symbol"].(string), v["Bithumb"].(string))

		pushDepthChan(4, v["Symbol"].(string), v["Coinone"].(string))

		pushDepthChan(5, v["Symbol"].(string), v["Korbit"].(string))

		pushDepthChan(6, v["Symbol"].(string), v["Coinnest"].(string))

		pushDepthChan(7, v["Symbol"].(string), v["Gate"].(string))
		/*
			pushDepthChan(8, v["Symbol"].(string), v["Okex"].(string))


				go getDepthData(2, v["Symbol"].(string), v["Bithumb"].(string))
				go getDepthData(4, v["Symbol"].(string), v["Coinone"].(string))
				go getDepthData(5, v["Symbol"].(string), v["Korbit"].(string))
				go getDepthData(6, v["Symbol"].(string), v["Coinnest"].(string))
				go getDepthData(7, v["Symbol"].(string), v["Gate"].(string))
				go getDepthData(8, v["Symbol"].(string), v["Okex"].(string))
		*/
	}
	beego.Trace("end")

}

func pushDepthChan(platform int, symbol, currency string) {
	depthChan <- Subdepth{Platform: platform, Symbol: symbol, Currency: currency}
}

func getDepthData(platform int, symbol, currency string) {

	bids, asks, ts := float64(0), float64(0), int64(0)

	if currency == "" {
		return
	}

	switch platform {

	case 2:
		obj := models.Bithumb{}
		bids, asks, ts = obj.Depth(currency, 0)
		//beego.Trace("触发:Bithumb", symbol)

	case 4:
		obj := models.Coinone{}
		bids, asks, ts = obj.Depth(currency, 0)
		//beego.Trace("触发:Coinone", symbol)

	case 5:
		obj := models.Korbit{}
		bids, asks, ts = obj.Depth(currency, 0)
		//beego.Trace("触发:Korbit", symbol)

	case 6:
		obj := models.Coinnest{}
		bids, asks, ts = obj.Depth(currency, 0)
		//beego.Trace("触发:Coinnest", symbol)

	case 7:
		obj := models.Gate{}
		bids, asks, ts = obj.Depth(currency, 0)
		//beego.Trace("触发:Gate", symbol)

	default:
		return
	}

	if bids != 0 && asks != 0 {

		//beego.Trace(bids, asks, ts)

		data := fmt.Sprintf(msgTemplate, symbol, platform, bids, asks, ts)
		go service.Publish(0, data)
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
	}

}

//获取币种信息
func GetSymbol() {
	db := tsDb.NewDbBase()
	oSymbol := models.Symbol{}
	symbolData, _ = db.DbList(&oSymbol)
	beego.Trace("币种获取完毕")

}
