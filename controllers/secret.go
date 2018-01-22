package controllers

import (
	"Deal/models"
	_ "fmt"
	"github.com/astaxie/beego"
	"tsEngine/tsDb"
	"tsEngine/tsString"
)

type SecretController struct {
	BaseController
}

//类似构造函数
func (this *SecretController) Prepare() {
	//权限判断
	this.CheckPermission()
}

func (this *SecretController) List() {

	Keyword := this.GetString("Keyword")
	Page, _ := this.GetInt64("Page")
	PageSize, _ := this.GetInt64("PageSize")

	o := models.Secret{}

	items, pagination, err := o.List(Page, PageSize, Keyword)

	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "数据库异常错误，请联系管理员"
		this.TraceJson()
	}

	this.Code = models.SuccessProto
	this.Result = map[string]interface{}{"Items": items, "Pagination": pagination}
	this.TraceJson()

}

func (this *SecretController) Add() {

	o := models.Secret{}
	o.Uid = this.AdminId
	o.AccessKey = this.GetString("AccessKey")
	o.SecretKey = this.GetString("SecretKey")

	db := tsDb.NewDbBase()
	_, err := db.DbInsert(&o)
	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "数据库操作异常，请联系管理员"
		this.TraceJson()
	}

	this.Code = 1
	this.Result = o
	this.TraceJson()
}

func (this *SecretController) Edit() {

	//初始化
	db := tsDb.NewDbBase()
	o := models.Secret{}

	//获取get数据
	o.Id = tsString.ToInt64(this.Ctx.Input.Param("0"))
	if o.Id > 0 {
		err := db.DbGet(&o)
		if err != nil {
			beego.Error(err)
			this.Code = 0
			this.Msg = "没有该记录"
			this.TraceJson()
		}

		this.Code = 1
		this.Result = o
		this.TraceJson()
	}

	//获取post数据
	o.Id, _ = this.GetInt64("Id")
	o.AccessKey = this.GetString("AccessKey")
	o.SecretKey = this.GetString("SecretKey")

	//****************************************************
	err := db.DbUpdate(&o, "AccessKey", "SecretKey")

	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "参数错误或没有任何修改"
		this.TraceJson()
	}

	this.Code = 1
	this.Result = o
	this.TraceJson()

}

func (this *SecretController) Del() {

	o := models.Secret{}
	o.Id, _ = this.GetInt64("Id")
	db := tsDb.NewDbBase()
	err := db.DbRead(&o)
	if err != nil {
		this.Code = 0
		this.Msg = "参数错误"
		this.TraceJson()
	}

	err = db.DbDel(&o)
	if err != nil {
		beego.Error(err)
		this.Code = 0
		this.Msg = "数据库异常错误，请联系管理员"
		this.TraceJson()
	}
	this.Code = 1
	this.TraceJson()

}
