package models

import (
	"github.com/astaxie/beego/orm"
)

//订单表模型
type Order struct {
	Id      int64
	OrderId string
	Pid     float64
	Amount  string
	Price   string
	Symbol  string
	Type    string
	Time    string
}

func init() {
	orm.RegisterModel(new(Order))
}

func (this *Order) TableName() string {
	return "base_order"
}

/************************************************************/
