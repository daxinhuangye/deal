package controllers

import (
	"Deal/models"
	"tsEngine/tsDb"
	"tsEngine/tsTime"

	"github.com/astaxie/beego"
)

type SettingsController struct {
	BaseController
}

//类似构造函数
func (this *SettingsController) Prepare() {
	this.CheckPermission()
}

//配置信息
func (this *SettingsController) View() {

	//初始化
	db := tsDb.NewDbBase()
	o := models.Settings{}
	o.Uid = this.AdminId

	err := db.DbGet(&o, "Uid")
	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "参数错误"
		this.TraceJson()
	}
	this.Code = 1
	this.Result = o.Data
	this.TraceJson()

}

//修改配置信息
func (this *SettingsController) Edit() {

	//初始化
	db := tsDb.NewDbBase()
	o := models.Settings{}
	o.Uid = this.AdminId

	err := db.DbGet(&o, "Uid")
	//获取post数据
	o.Data = this.GetString("Data")
	o.Time = tsTime.CurrSe()

	if err != nil {

		_, err := db.DbInsert(&o)
		if err != nil {
			beego.Error(err)
			this.Code = 0
			this.Msg = "数据库异常错误，请联系管理员"
			this.TraceJson()
		}
		this.Code = 1
		this.Result = o
		this.TraceJson()
	}

	//****************************************************
	err = db.DbUpdate(&o, "Data", "Time")

	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "参数错误或没有任何修改"
		this.TraceJson()
	}

	this.Code = 1
	this.TraceJson()

}
