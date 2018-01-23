package models

import (
	"github.com/astaxie/beego/orm"
	"tsEngine/tsPagination"
)

//订单表模型
type Order struct {
	Id      int64
	Uid     int64
	OrderId string
	Pid     float64
	Amount  string
	buy     string
	sell    string
	Symbol  string
	Type    string
	Time    string
	State   int64
}

func init() {
	orm.RegisterModel(new(Order))
}

func (this *Order) TableName() string {
	return "data_order"
}

/************************************************************/

func (this *Order) List(page int64, page_size int64, keyword string) (data []orm.Params, pagination *tsPagination.Pagination, err error) {

	op := orm.NewOrm().QueryTable(this)

	if keyword != "" {
		cond := orm.NewCondition().And("Ip__icontains", keyword).Or("Description__icontains", keyword)
		op = op.SetCond(cond)
	}

	count, _ := op.Count()

	pagination = tsPagination.NewPagination(page, page_size, count)

	op = op.Limit(page_size, pagination.GetOffset())

	op = op.OrderBy("-Id")

	_, err = op.Values(&data)

	return data, pagination, err

}
