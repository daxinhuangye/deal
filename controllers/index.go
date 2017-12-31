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

	huobi := models.Huobi{}
	data := huobi.Depth()
	this.Ctx.WriteString(data)

}

//默认网站首页
func (this *IndexController) Test() {

	huobi := models.Huobi{}
	data := huobi.GetAccounts()
	this.Ctx.WriteString(data)
}
