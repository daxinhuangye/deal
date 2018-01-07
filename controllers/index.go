package controllers

import (
	_ "Deal/models"
	"Deal/service"
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

}

//默认网站首页
func (this *IndexController) Start() {

	//获取实例对象
	auto := service.GetInstance()
	auto.Start()
	this.Ctx.WriteString("停止")
}

//默认网站首页
func (this *IndexController) Stop() {

	//获取实例对象
	auto := service.GetInstance()
	auto.Stop()
	this.Ctx.WriteString("停止")

}
