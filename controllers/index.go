package controllers

import (
	"Deal/models"
	_ "github.com/astaxie/beego"
)

type IndexController struct {
	BaseController
}

//类似构造函数
func (this *IndexController) Prepare() {

}

//默认网站首页
func (this *IndexController) Get() {

	this.Data["type"] = "index"
	this.Display("index", true)

}

//默认网站首页
func (this *IndexController) Test() {

	huobi := models.Huobi{}
	data := huobi.Trade()
	this.Ctx.WriteString(data)
}
