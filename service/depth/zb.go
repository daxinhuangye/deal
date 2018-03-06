package depth

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"strings"

	"github.com/tidwall/gjson"
)

var (
	zb_wss = "wss://api.zb.com:9999/websocket"
)

func ZbRun() {

	//连接
	err := models.WsConn(zb_wss)
	if err != nil {
		go models.SendMail("ZB 平台wss无法连接，请及时处理~~")
		return
	}
	//数据监听
	go func() {
		for {
			//获取数据
			data, err := models.WsRead(zb_wss)
			//如果读取错误，从新连接服务器
			if err != nil {
				err = models.WsConn(zb_wss)
				if err != nil {
					go models.SendMail("ZB 平台重新连接失败~~~")
					break
				} else {
					continue
				}
			}

			content := string(data)

			ch := gjson.Get(content, "channel").String()
			if ch != "" {

				symbol := symbolManage["zb_"+ch]
				bids := float64(0)
				asks := float64(0)

				//卖盘
				tick := gjson.Get(content, "asks").Array()
				index := len(tick) - 1
				if index >= 0 {
					temp := tick[index].Array()
					asks = temp[0].Float()
				}

				//买盘
				tick = gjson.Get(content, "bids").Array()
				if len(tick) > 0 {
					temp := tick[0].Array()
					bids = temp[0].Float()
				}

				//时间
				ts := gjson.Get(content, "timestamp").Int()

				str := fmt.Sprintf(`{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`, symbol, 9, bids, asks, ts)
				service.Publish(0, str)
			}

		}
		defer models.WsClose(zb_wss)
	}()

	//初始化数据 //使用火币的币种
	for _, v := range symbolData {
		if v["Zb"].(string) != "" {
			temp := strings.Replace(v["Zb"].(string), "_", "", -1)
			key := fmt.Sprintf(`%s_depth`, temp)
			symbol := fmt.Sprintf(`{'event':'addChannel','channel':'%s'}`, key)
			symbolManage["zb_"+key] = v["Symbol"].(string)
			models.WsSend(zb_wss, symbol)
		}

	}

}
