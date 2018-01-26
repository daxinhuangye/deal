package models

import (
	"github.com/astaxie/beego/orm"
)

type Settings struct {
	Id   int64  // 编号
	Uid  int64  // 用户id
	Data string // 基础数据
	Time uint64 // 修改时间

}

func init() {
	orm.RegisterModel(new(Settings))
}

func (this *Settings) TableName() string {
	return "data_settings"
}
