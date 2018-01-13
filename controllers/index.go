package controllers

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"github.com/astaxie/beego"
	"reflect"
	"strings"
	"time"
	"tsEngine/tsDb"
	"tsEngine/tsTime"
)

type IndexController struct {
	BaseController
}

//类似构造函数
func (this *IndexController) Prepare() {

}

func (this *IndexController) Test() {
	obj := models.Bithumb{}

	price := int64(2510)
	num := float64(10)
	symbol := "XRP"
	_type := "ask"
	con := obj.CreateOrder(price, num, symbol, _type)

	//con := obj.GetOrders()
	beego.Trace(con)
	this.Ctx.WriteString(con)

}

//默认网站首页
func (this *IndexController) Get() {
	this.Display("index", false)
}

func GetDepth(platform string, symbol string) {
	depth := make(map[string]string)
	switch platform {
	case "huobi":
		obj := models.Huobi{}
		_symbol := strings.ToLower(symbol) + "usdt"
		for {

			buy, sell := obj.Depth(_symbol, 0)
			key := fmt.Sprintf("huobi_%s", symbol)
			value := fmt.Sprintf("%f_%f", buy, sell)
			if buy != 0 && sell != 0 && depth[key] != value {
				depth[key] = value
				_buy := buy * 7
				_sell := sell * 7
				timestamp := tsTime.CurrSe()
				data := fmt.Sprintf(`{"symbol":"%s", "platform":"huobi", "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, buy, sell, _buy, _sell, timestamp)

				publish <- newEvent(models.EVENT_MESSAGE, 0, data)
			}

			time.Sleep(1 * time.Second)
		}

	case "bithumb":
		obj := models.Bithumb{}
		for {

			buy, sell := obj.Depth(symbol, 0)
			key := fmt.Sprintf("bithumb_%s", symbol)
			value := fmt.Sprintf("%f_%f", buy, sell)
			if buy != 0 && sell != 0 && depth[key] != value {
				depth[key] = value
				_buy := buy * 0.006
				_sell := sell * 0.006
				timestamp := tsTime.CurrSe()
				data := fmt.Sprintf(`{"symbol":"%s", "platform":"bithumb", "bids":%f, "asks":%f, "_bids":%f, "_asks":%f, "time":%d}`, symbol, buy, sell, _buy, _sell, timestamp)

				publish <- newEvent(models.EVENT_MESSAGE, 0, data)
			}
			time.Sleep(1 * time.Second)

		}
	}

}

func (this *IndexController) Send() {

	db := tsDb.NewDbBase()
	oSymbol := models.Symbol{}
	symbol_list, _ := db.DbList(&oSymbol)

	for _, v := range symbol_list {
		go GetDepth("huobi", v["Symbol"].(string))
		go GetDepth("bithumb", v["Symbol"].(string))
	}

	this.Ctx.WriteString("44444444")
}

//默认网站首页
func (this *IndexController) Getbak() {

	//obj := make(map[string]models.Bithumb)
	obj := models.Bithumb{}

	reflect.ValueOf(&obj).MethodByName("GetAccounts").Call([]reflect.Value{})
	/*
		v := reflect.ValueOf(&obj)

		callMethod(&v, "GetAccounts", []interface{}{})

			str := "Bithumb"
			if obj[str] != nil {

				v := reflect.ValueOf(obj["Bithumb"])

				callMethod(&v, "GetAccounts", []interface{}{})

				//beego.Trace(v)
			}

			//obj["Bithumb"] = models.Bithumb{}

			//v.Depth("XRP", 5)
			//obj["Bithumb"].GetOrders("")
	*/
	this.Ctx.WriteString("123")
}

// 场景2：调用结构体方法
func callMethod(v *reflect.Value, method string, params []interface{}) {
	// 字符串方法调用，且能找到实例conf的属性.Op
	f := v.MethodByName(method)
	fmt.Println(method)
	if f.IsValid() {
		args := make([]reflect.Value, len(params))
		for k, param := range params {
			args[k] = reflect.ValueOf(param)
		}
		// 调用
		ret := f.Call(args)
		fmt.Println(ret)
		if ret[0].Kind() == reflect.String {
			fmt.Printf("%s Called result: %s\n", method, ret[0].String())
		}
	} else {
		fmt.Println("can't call " + method)
	}
	fmt.Println("")
}

//默认网站首页
func (this *IndexController) Start() {

	//获取实例对象
	auto := service.GetInstance()
	auto.Start()
	this.Ctx.WriteString("已经开始自动交易")
}

//默认网站首页
func (this *IndexController) Stop() {

	//获取实例对象
	auto := service.GetInstance()
	auto.Stop()
	this.Ctx.WriteString("停止")

}
