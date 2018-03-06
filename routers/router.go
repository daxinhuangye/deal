package routers

import (
	"Deal/controllers"
	"Deal/controllers/admin"

	"github.com/astaxie/beego"
)

func init() {

	beego.AutoRouter(&controllers.IndexController{})
	beego.AutoRouter(&controllers.DepthController{})
	beego.AutoRouter(&controllers.SettingsController{})
	beego.AutoRouter(&controllers.SecretController{})
	beego.AutoRouter(&controllers.OrderController{})
	beego.AutoRouter(&controllers.ApiController{})
	beego.AutoRouter(&controllers.ApppubController{})
	beego.AutoRouter(&controllers.TradingController{})

	/*********************系统路由********************************/

	beego.Router("/", &admin.IndexController{})

	// 登录
	beego.AutoRouter(&admin.LoginController{})

	// 节点
	beego.AutoRouter(&admin.NodeController{})

	// 模块管理
	beego.AutoRouter(&admin.ModeController{})

	// 管理员
	beego.AutoRouter(&admin.AdminController{})

	// 角色
	beego.AutoRouter(&admin.RoleController{})

	// ip屏蔽
	beego.AutoRouter(&admin.IpbanController{})

	// 日志
	beego.AutoRouter(&admin.LogsController{})

	//公共
	beego.AutoRouter(&admin.PublicController{})

	//Uedit富文本编辑器
	beego.AutoRouter(&admin.UeditorController{})

}
