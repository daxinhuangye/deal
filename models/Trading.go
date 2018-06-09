package models

import (
	"tsEngine/tsPagination"

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

func (this *Trading) List(page int64, page_size int64) (data []orm.Params, pagination *tsPagination.Pagination, err error) {

	op := orm.NewOrm().QueryTable(this)

	if this.Symbol != "" {
		op = op.Filter("Symbol", this.Symbol)
	}

	if this.Period != "" {
		op = op.Filter("Period", this.Period)
	}

	count, _ := op.Count()

	pagination = tsPagination.NewPagination(page, page_size, count)

	op = op.Limit(page_size, pagination.GetOffset())

	op = op.OrderBy("-TickId")

	_, err = op.Values(&data)

	return data, pagination, err

}
