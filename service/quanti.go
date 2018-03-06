package service

import (
	"Deal/models"
	_ "fmt"
	_ "strings"
	"time"
	_ "tsEngine/tsTime"

	_ "container/list"

	"github.com/astaxie/beego"
	_ "github.com/gorilla/websocket"
	"github.com/tidwall/gjson"
)

type Quanti struct {
	Platform int64

	Content string
}

var (
	min5Chan = make(chan Quanti, 100)

	min5Map = make(map[uint64]models.Trading)
)

func init() {
	go quantiRun()
}

func quantiRun() {
	min5List := models.NewQueue()
	beego.Trace(min5List.Data)
	for {
		select {
		case obj := <-min5Chan:
			if obj.Content != "" {
				tick := models.Trading{}
				tick.Symbol = gjson.Get(obj.Content, "ch").String()
				tick.Ts = gjson.Get(obj.Content, "ts").Uint()
				tick.TickId = gjson.Get(obj.Content, "tick.id").Uint()
				tick.Open = gjson.Get(obj.Content, "tick.open").Float()
				tick.Close = gjson.Get(obj.Content, "tick.close").Float()
				tick.Low = gjson.Get(obj.Content, "tick.low").Float()
				tick.High = gjson.Get(obj.Content, "tick.high").Float()
				tick.Amount = gjson.Get(obj.Content, "tick.amount").Float()
				tick.Vol = gjson.Get(obj.Content, "tick.vol").Float()

				min5List.Dump()
			}
		default:
		}
		time.Sleep(500 * time.Millisecond)
	}
}

func QuantiAdd(platform int64, content string) {
	min5Chan <- Quanti{Platform: platform, Content: content}
}
