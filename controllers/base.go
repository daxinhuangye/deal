package controllers

import (
	"github.com/astaxie/beego"
	"github.com/beego/i18n"
	"strings"
	"tsEngine/tsString"
	"tsEngine/tsTime"
)

type BaseController struct {
	beego.Controller
	i18n.Locale
	Code    int
	Msg     string
	Result  interface{}
	LoginId int64
}

var langTypes []string // Languages that are supported.

func init() {
	beego.Trace("初始化控制器")
	//获取语言包列表
	langTypes = strings.Split(beego.AppConfig.String("LangTypes"), "|")

	//载入语言包
	for _, lang := range langTypes {
		beego.Trace("载入语言包: " + lang)
		if err := i18n.SetMessage(lang, "static/i18n/"+"locale_"+lang+".ini"); err != nil {
			beego.Error("错误载入:", err)
			return
		}
	}

}

func (this *BaseController) Display(tpl string, layout bool) {

	this.Data["Version"] = beego.AppConfig.String("Version")

	if beego.AppConfig.String("runmode") == "dev" {
		this.Data["Version"] = tsTime.CurrSe()
	}

	this.Data["Appname"] = beego.AppConfig.String("AppName")
	this.Data["Website"] = beego.AppConfig.String("WebSite")
	this.Data["Weburl"] = beego.AppConfig.String("WebUrl")
	this.Data["Email"] = beego.AppConfig.String("Email")
	if layout {
		this.Layout = "layout/main.html"
	}
	this.TplName = tpl + ".html"
}

//json 输出
func (this *BaseController) TraceJson() {
	this.Data["json"] = &map[string]interface{}{"Code": this.Code, "Msg": this.Msg, "Data": this.Result}
	this.ServeJSON()
	this.StopRun()
}

//登录判断
func (this *BaseController) CheckLogin(redirect ...bool) {

	this.LoginId = tsString.ToInt64(this.Ctx.GetCookie("LoginId"))

	if this.LoginId == 0 {
		if len(redirect) > 0 {
			if redirect[0] {
				this.Ctx.Redirect(302, "/open/login")
				return
			}
		}

	}

}

func (this *BaseController) IsMobile() bool {

	agent := this.Ctx.Request.UserAgent()

	rule := []string{"Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"}

	for i := 0; i < len(rule); i++ {
		if strings.Contains(agent, rule[i]) {
			return true
		}

	}
	return false
}
