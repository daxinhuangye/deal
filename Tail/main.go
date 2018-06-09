package main

import (
	"fmt"

	"github.com/hpcloud/tail"
)

//默认启动
func main() {
	t, _ := tail.TailFile("d:\\logs.txt", tail.Config{Follow: true})
	for line := range t.Lines {
		fmt.Println(line.Text)
	}

}
