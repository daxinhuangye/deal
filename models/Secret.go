package models

import (
	"github.com/astaxie/beego/orm"
	"tsEngine/tsPagination"
)

//秘钥表模型
type Secret struct {
	Id        int64
	Uid       int64
	AccessKey string
	SecretKey string
}

func init() {
	orm.RegisterModel(new(Secret))
}

func (this *Secret) TableName() string {
	return "data_secret"
}

/************************************************************/

func (this *Secret) List(page int64, page_size int64, keyword string) (data []orm.Params, pagination *tsPagination.Pagination, err error) {

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
