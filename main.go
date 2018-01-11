package main

import (
	_ "Deal/routers"
	"tsEngine/tsDb"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/beego/i18n"
)

func Indexaddone(index int) (index1 int) {
	index1 = index + 1
	return
}

//默认启动
func main() {

	beego.AddFuncMap("indexaddone", Indexaddone) //模板中使用{{indexaddone $index}}或{{$index|indexaddone}}
	beego.AddFuncMap("i18n", i18n.Tr)
	//log记录设置
	beego.SetLogger("file", `{"filename":"./logs/logs.log"}`)
	//beego.SetLevel(beego.LevelInformational)
	beego.SetLogFuncCall(true)

	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	}

	//数据库连接
	tsDb.ConnectDb()

	beego.Run()
}
