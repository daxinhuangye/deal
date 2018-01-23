package controllers

import (
	"Deal/models"
	_ "fmt"
	"tsEngine/tsDb"

	_ "github.com/astaxie/beego"
)

type OrderController struct {
	BaseController
}

//类似构造函数
func (this *OrderController) Prepare() {
	this.CheckPermission()
}

//获取订单列表
func (this *OrderController) List() {
	db := tsDb.NewDbBase()
	o := models.Order{}
	list, _ := db.DbList(&o, "Uid", this.AdminId)
	this.Result = list
	this.TraceJson()

}

//下单
func (this *OrderController) Add() {

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

//退单
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
