package models

import (
	"github.com/astaxie/beego/orm"
)

type Settings struct {
	Id              int64   // 编号
	Pid             int64   // 平台Id
	Sid             int64   // 货币Id
	Currency        string  // 法币
	PricePrecision  int64   // 单价精度
	AmountPrecision int64   // 数量精度
	DealCost        float64 // 交易费
	Fee             float64 // 手续费
}

func init() {
	orm.RegisterModel(new(Settings))
}

func (this *Settings) TableName() string {
	return "data_settings"
}
