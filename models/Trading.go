package models

import (
	_ "tsEngine/tsPagination"

	"github.com/astaxie/beego/orm"
)

//币种表模型
type Trading struct {
	Id     int64
	TickId uint64
	Ts     uint64
	Period string
	Symbol string
	Open   float64
	Close  float64
	Low    float64
	High   float64
	Amount float64
	Vol    float64
}

func init() {
	orm.RegisterModel(new(Trading))
}

func (this *Trading) TableName() string {
	return "data_trading"
}
