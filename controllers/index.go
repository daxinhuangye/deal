package controllers

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	"reflect"

	"github.com/astaxie/beego"
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

// Join method handles POST requests for AppController.
func (this *IndexController) Join() {
	// Get form value.
	uname := this.GetString("uname")
	tech := this.GetString("tech")

	// Check valid.
	if len(uname) == 0 {
		this.Redirect("/", 302)
		return
	}

	switch tech {
	case "longpolling":
		this.Redirect("/lp?uname="+uname, 302)
	case "websocket":
		this.Redirect("/ws?uname="+uname, 302)
	default:
		this.Redirect("/", 302)
	}

	// Usually put return after redirect.
	return
}
func (this *IndexController) Send() {

	go func() {
		obj := models.Huobi{}
		count := 0
		for {
			count++
			buy, sell := obj.Depth("xrpusdt", 10)
			uname := "Huobi:" + fmt.Sprintf("请求次数：%d", count)
			data := fmt.Sprintf("当前买入:%f;当前卖出：%f", buy, sell)
			beego.Info("user:", uname, "content:", data)
			publish <- newEvent(models.EVENT_MESSAGE, uname, data)
		}
	}()

	go func() {
		obj := models.Bithumb{}
		count := 0
		for {
			count++
			buy, sell := obj.Depth("XRP", 10)
			uname := "Bithumb:" + fmt.Sprintf("请求次数：%d", count)
			data := fmt.Sprintf("当前买入:%f;当前卖出：%f", buy, sell)
			beego.Info("user:", uname, "content:", data)
			publish <- newEvent(models.EVENT_MESSAGE, uname, data)
		}
	}()

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
