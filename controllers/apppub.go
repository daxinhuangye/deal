//公共控制器

package controllers

import (
	"Deal/models"
	"github.com/astaxie/beego"
	"tsEngine/tsDb"
)

type ApppubController struct {
	BaseController
}

//类似构造函数
func (this *ApppubController) Prepare() {
	//权限判断
	this.CheckLogin()
}

//平台配置
func (this *ApppubController) Platform() {
	o := models.Platform{}

	order := []string{}

	db := tsDb.NewDbBase()
	items, err := db.DbListOrder(&o, order)

	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "数据库操作异常，请联系管理员"
		this.TraceJson()
	}

	this.Code = 1
	this.Result = items
	this.TraceJson()
}
