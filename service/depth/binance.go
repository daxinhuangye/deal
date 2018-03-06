package depth

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"strings"

	"github.com/astaxie/beego"
	"github.com/tidwall/gjson"
)

func BinanceRun() {
	for _, v := range symbolData {
		symbol := v["Symbol"].(string)
		_symbol := v["Binance"].(string)
		if _symbol != "" {
			_symbol := strings.ToLower(_symbol)
			wss := fmt.Sprintf("wss://stream.binance.com:9443/ws/%s@depth5", _symbol)
			err := models.WsConn(wss)
			if err != nil {
				beego.Error(err)
				continue
			}
			go binanceRead(symbol, wss)
		}
	}

}

func binanceRead(symbol, wss string) {
	for {
		//获取数据
		data, err := models.WsRead(wss)
		if err != nil {
			err = models.WsConn(wss)
			if err != nil {
				go models.SendMail("币安平台重新连接失败~~~")
				break
			} else {
				continue
			}
		}
		content := string(data)

		ch := gjson.Get(content, "lastUpdateId").Int()
		if ch > 0 {

			//卖盘
			tick := gjson.Get(content, "asks").Array()
			temp := tick[0].Array()
			asks := temp[0].Float()

			//买盘
			tick = gjson.Get(content, "bids").Array()
			temp = tick[0].Array()
			bids := temp[0].Float()

			//时间
			ts := ch

			str := fmt.Sprintf(`{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`, symbol, 3, bids, asks, ts)
			service.Publish(0, str)
		}

	}
	defer models.WsClose(wss)
}
