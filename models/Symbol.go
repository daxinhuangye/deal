package models

import (
	"github.com/astaxie/beego/orm"
)

//币种表模型
type Symbol struct {
	Id      int64
	Symbol  string
	Huobi   string
	Bithumb string
	Surplus int64
	Amount  float64
	State   int64
}

func init() {
	orm.RegisterModel(new(Symbol))
}

func (this *Symbol) TableName() string {
	return "base_symbol"
}

/************************************************************/
