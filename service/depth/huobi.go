package depth

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"strings"
	"tsEngine/tsTime"

	"github.com/astaxie/beego"
	"github.com/tidwall/gjson"
)

var (
	huobi_wss = "wss://api.huobi.pro/ws"
)

func HuobiRun() {

	//连接
	err := models.WsConn(huobi_wss)
	if err != nil {
		go models.SendMail("火币平台wss无法连接，请及时处理~~")
		beego.Error("连接失败")
		return
	}
	beego.Error("开始监听火币网")
	//数据监听
	go func() {
		for {
			//获取数据
			data, err := models.WsRead(huobi_wss)
			//如果读取错误，从新连接服务器
			if err != nil {

				go models.SendMail("火币平台重新连接")
				//service.Publish(0, data)
				err = models.WsConn(huobi_wss)
				if err != nil {
					go models.SendMail("火币平台重新连接失败~~~")
					break
				} else {
					continue
				}
			}
			//解压数据
			result, _ := models.ParseGzip(data)
			content := string(result)

			//心跳监听
			ping := gjson.Get(content, "ping").Int()
			if ping > 0 {
				msg := fmt.Sprintf(` {"pong": %d}`, ping)
				models.WsSend(huobi_wss, msg)
			}

			ch := gjson.Get(content, "ch").String()
			if ch != "" {
				//判断是否5分钟数据
				if strings.Contains(ch, "kline.5min") {

					//向管道中添加数据
					service.QuantiAdd(1, content)

				} else {
					//beego.Trace("数据：", content)
					symbol := symbolManage["huobi_"+ch]
					//卖盘
					tick := gjson.Get(content, "tick.asks").Array()
					temp := tick[0].Array()
					asks := temp[0].Float()

					//买盘
					tick = gjson.Get(content, "tick.bids").Array()
					temp = tick[0].Array()
					bids := temp[0].Float()

					//时间
					ts := gjson.Get(content, "tick.ts").Int()

					str := fmt.Sprintf(`{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`, symbol, 1, bids, asks, ts)
					service.Publish(0, str)
				}

			}

		}
		defer models.WsClose(huobi_wss)
	}()

	client_id := fmt.Sprintf("ATM_%d", tsTime.CurrMs())
	//初始化数据
	for _, v := range symbolData {

		min5 := fmt.Sprintf(`{"sub": "market.%s.kline.5min","id": "%s"}`, v["Huobi"].(string), client_id)
		key := fmt.Sprintf(`market.%s.depth.step0`, v["Huobi"].(string))
		symbol := fmt.Sprintf(`{"sub": "%s", "id": "%s"}`, key, client_id)
		symbolManage["huobi_"+key] = v["Symbol"].(string)
		models.WsSend(huobi_wss, symbol)
		models.WsSend(huobi_wss, min5)
	}

}