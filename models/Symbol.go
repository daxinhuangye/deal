package models

import (
	"github.com/astaxie/beego/orm"
)

//币种表模型
type Symbol struct {
	Id       int64
	Symbol   string
	Sort     int64
	Huobi    string
	Bithumb  string
	Binance  string
	Coinone  string
	Korbit   string
	Coinnest string
	Gate     string
	Okex     string
	Zb       string
}

func init() {
	orm.RegisterModel(new(Symbol))
}

func (this *Symbol) TableName() string {
	return "base_symbol"
}

/************************************************************/
