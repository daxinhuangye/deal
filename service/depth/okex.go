package depth

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	_ "strings"
	_ "tsEngine/tsTime"

	"tsEngine/tsString"

	"github.com/astaxie/beego"
	"github.com/tidwall/gjson"
)

var (
	okex_wss = "wss://real.okex.com:10441/websocket"
)

func OkexRun() {

	//连接服务器
	err := models.WsConn(okex_wss)
	if err != nil {
		go models.SendMail("okex_wss无法连接，请及时处理~~")
		beego.Error("连接失败")
		return
	}
	beego.Error("开始监听火币网")
	//数据监听
	go listionOkexRead()

	//订阅货币数据
	go subOkex()

}

//订阅货币数据
func subOkex() {
	for _, v := range symbolData {
		key := fmt.Sprintf(`ok_sub_spot_%s_depth_5`, v["Okex"].(string))
		symbol := fmt.Sprintf(`{'event':'addChannel','channel':'%s'}`, key)
		symbolManage["okex_"+key] = v["Symbol"].(string)
		models.WsSend(okex_wss, symbol)
	}
}
func reConnOkex() error {
	//先关闭
	models.WsClose(okex_wss)
	//再连接
	err := models.WsConn(okex_wss)
	if err != nil {
		go models.SendMail("okex_wss重新连接失败~~~")
		return err
	}
	//再发送订阅
	subOkex()
	return nil
}

//监听数据
func listionOkexRead() {
	defer models.WsClose(okex_wss)
	for {
		//获取数据
		data, err := models.WsRead(okex_wss)
		//如果读取错误，从新连接服务器
		if err != nil {
			//重新连接
			err = reConnOkex()
			if err != nil {
				break
			} else {
				continue
			}
		}

		content := string(data)
		content = tsString.Substr(content, 1, len(content)-1)
		//beego.Trace(content)
		ch := gjson.Get(content, "channel").String()
		if ch != "" {

			symbol := symbolManage["okex_"+ch]
			bids := float64(0)
			asks := float64(0)

			//卖盘
			tick := gjson.Get(content, "data.asks").Array()
			index := len(tick) - 1
			if index >= 0 {
				temp := tick[index].Array()
				asks = temp[0].Float()
			}

			//买盘
			tick = gjson.Get(content, "data.bids").Array()
			if len(tick) > 0 {
				temp := tick[0].Array()
				bids = temp[0].Float()
			}

			//时间
			ts := gjson.Get(content, "timestamp").Int()

			str := fmt.Sprintf(`{"symbol":"%s", "platform":%d, "bids":%f, "asks":%f, "time":%d}`, symbol, 8, bids, asks, ts)
			service.Publish(0, str)

		}

	}

}
