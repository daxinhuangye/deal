package controllers

import (
	"Deal/models"
	"Deal/service"
	"fmt"
	_ "github.com/astaxie/beego"
	"reflect"
)

type IndexController struct {
	BaseController
}

//类似构造函数
func (this *IndexController) Prepare() {

}

//默认网站首页
func (this *IndexController) Get() {
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
