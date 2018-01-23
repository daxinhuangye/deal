package service

import (
	"Deal/models"
	"fmt"
	"time"
	"tsEngine/tsTime"
)

//订单监听
func CheckOrder(platform int64, order_id string) {
	switch platform {
	case 1:
		obj := models.Huobi{}
		for {
			state := obj.OrderInfo(order_id)
			//如果订单全部完成跳出监听
			if state == "filled" {
				//推送消息
				timestamp := tsTime.CurrSe()
				data := fmt.Sprintf(`{"orderId":"%s", "platform":1,  "time":%d}`, order_id, timestamp)

				Publish(0, data)
				break
			}
			time.Sleep(1 * time.Second)

		}

	case 2:

	}
}
