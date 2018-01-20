package models

import (
	"github.com/astaxie/beego/orm"
)

type Settings struct {
	Id     int64  // 编号
	Uid    int64  // 用户id
	Base   string // 基础配置
	Symbol string // 币种配置

}

func init() {
	orm.RegisterModel(new(Settings))
}

func (this *Settings) TableName() string {
	return "data_settings"
}
