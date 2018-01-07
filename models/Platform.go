package models

import (
	"github.com/astaxie/beego/orm"
)

//币种表模型
type Platform struct {
	Id       int64
	Platform string  //平台
	Rate     float64 //汇率
	Fee      float64 //手续费
}

func init() {
	orm.RegisterModel(new(Platform))
}

func (this *Platform) TableName() string {
	return "base_platform"
}

/************************************************************/
