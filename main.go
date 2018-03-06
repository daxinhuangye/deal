package main

import (
	_ "Deal/routers"
	_ "Deal/service"
	"Deal/service/depth"
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

	//模板中使用{{indexaddone $index}}或{{$index|indexaddone}}
	beego.AddFuncMap("indexaddone", Indexaddone)
	beego.AddFuncMap("i18n", i18n.Tr)
	//log记录设置
	beego.SetLogger("file", `{"filename":"./logs/logs.log"}`)

	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	} else {
		beego.SetLevel(beego.LevelInformational)
	}
	beego.SetLogFuncCall(true)
	//数据库连接
	tsDb.ConnectDb()

	//获取币种信息
	depth.GetSymbol()

	//启动行情服务

	go depth.HuobiRun()
	go depth.BinanceRun()
	go depth.ZbRun()
	go depth.OkexRun()
	go depth.DepthRun()
	//go depth.BithumbRun()
	//go depth.KorbitRun()
	//go depth.DepthRun()
	//go depth.CoinoneRun()

	//go depth.OkexRun()
	//go depth.CoinoneRun()
	//高频交易服务启动
	//go service.QuantiRun()

	//框架启动
	beego.Run()
}
