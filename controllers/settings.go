package controllers

import (
	"Deal/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/validation"
	"tsEngine/tsDb"
	"tsEngine/tsString"
	"tsEngine/tsTime"
)

type SettingsController struct {
	BaseController
}

//类似构造函数
func (this *SettingsController) Prepare() {
	this.CheckPermission()
}

//屏蔽IP列表
func (this *SettingsController) List() {

	Keyword := this.GetString("Keyword")
	Page, _ := this.GetInt64("Page")
	PageSize, _ := this.GetInt64("PageSize")

	o := models.Ipban{}

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

func (this *SettingsController) Edit() {

	//初始化
	db := tsDb.NewDbBase()
	o := models.Ipban{}

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
	o.Ip = this.GetString("Ip")

	o.Description = this.GetString("Description")
	o.Start = tsTime.StringToSe(this.GetString("Start"), 2)
	o.End = tsTime.StringToSe(this.GetString("End"), 2)

	//****************************************************
	//数据验证
	valid := validation.Validation{}

	valid.Required(o.Ip, "Ip").Message("IP不能为空")

	if valid.HasErrors() {
		// 如果有错误信息，证明验证没通过
		// 打印错误信息
		for _, err := range valid.Errors {
			this.Code = 0
			this.Msg = err.Message
			this.TraceJson()
		}

	}

	//****************************************************
	err := db.DbUpdate(&o, "IP", "Description", "Start", "End")

	if err != nil {

		db := tsDb.NewDbBase()
		_, err := db.DbInsert(&o)

		beego.Error(err)
		this.Code = 0
		this.Msg = "参数错误或没有任何修改"
		this.TraceJson()
	}

	this.Code = 1
	this.Result = o
	this.TraceJson()

}
