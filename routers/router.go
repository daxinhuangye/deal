package routers

import (
	"Deal/controllers"
	"github.com/astaxie/beego"
)

func init() {

	beego.Router("/", &controllers.IndexController{})

	beego.AutoRouter(&controllers.IndexController{})

}
