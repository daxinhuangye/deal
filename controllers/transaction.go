package controllers

import (
	_ "github.com/astaxie/beego"
)

type TransactionController struct {
	BaseController
}

//类似构造函数
func (this *TransactionController) Prepare() {

}
