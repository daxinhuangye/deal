package models

import (
	"github.com/astaxie/beego/orm"
)

//币种表模型
type Platform struct {
	Id       int64
	Platform string  //平台
	Name     string  //名称
	Rate     float64 //汇率

}

func init() {
	orm.RegisterModel(new(Platform))
}

func (this *Platform) TableName() string {
	return "base_platform"
}

/************************************************************/
