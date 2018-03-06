package models

import (
	"container/list"
	"fmt"
	"sync"
)

type Queue struct {
	Data *list.List
}

var lock sync.Mutex

func NewQueue() *Queue {
	q := new(Queue)
	q.Data = list.New()
	return q
}

//在list的首部插入值为v的元素
func (this *Queue) Push(v interface{}) {
	defer lock.Unlock()
	lock.Lock()
	this.Data.PushFront(v)
}

//删除最后一个元素
func (this *Queue) Pop() interface{} {
	defer lock.Unlock()
	lock.Lock()
	iter := this.Data.Back()
	v := iter.Value
	this.Data.Remove(iter)
	return v
}

func (this *Queue) Dump() {
	for iter := this.Data.Back(); iter != nil; iter = iter.Prev() {
		fmt.Println("item:", iter.Value)
	}
}
