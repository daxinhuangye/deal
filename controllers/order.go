package controllers

import (
	_ "Deal/models"
	_ "fmt"
	_ "github.com/astaxie/beego"
)

type OrderController struct {
	BaseController
}

//类似构造函数
func (this *OrderController) Prepare() {

}

//默认网站首页
func (this *OrderController) Get() {
	this.Display("index", false)
}
