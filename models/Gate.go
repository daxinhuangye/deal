package models

import (
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

// api接口
type Gate struct {
	AccessKey string //appid
	SecretKey string //秘钥
	AccountId string
}

const (
	Gate_HOST        = "api.gate.io"
	Gate_CONTENTTYPE = "application/x-www-form-urlencoded"
	Gate_ACCEPT      = "application/json"
	Gate_LANGUAGE    = "zh-CN"
	Gate_AGENT       = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0"
)

//行情数据 btcusdt
func (this *Gate) Depth(symbol string, num float64) (float64, float64, int64) {

	api := "https://" + Gate_HOST + "/api2/1/orderBook/" + symbol

	content, err := this.request(api)
	if err != nil {
		//停2秒再去获取
		time.Sleep(2 * time.Second)
		content, err = this.request(api)
		if err != nil {
			beego.Error("再次获取依然错误:", err)
			return 0, 0, 0
		}

	}

	if content == "" {
		return 0, 0, 0
	}

	bids := float64(0)
	asks := float64(0)
	//卖盘

	tick := gjson.Get(content, "asks").Array()
	index := len(tick) - 1
	if index >= 0 {
		temp := tick[index].Array()
		asks = temp[0].Float()
	}

	//买盘
	tick = gjson.Get(content, "bids").Array()
	if len(tick) > 0 {
		temp := tick[0].Array()
		bids = temp[0].Float()
	}

	//时间
	ts := gjson.Get(content, "timestamp").Int()

	return bids, asks, ts

}

//网络请求
func (this *Gate) request(api string, fields ...interface{}) (string, error) {

	//创建链接
	curl := httplib.Get(api)

	if len(fields) > 0 {
		curl = httplib.Post(api)
		curl.JSONBody(fields[0])
	}

	//设置超时时间 2秒链接，3秒读数据
	curl.SetTimeout(3*time.Second, 3*time.Second)

	//获取请求的内容
	temp, err := curl.Bytes()
	if err != nil {
		return "", err
	}

	content := string(temp)
	status := gjson.Get(content, "result").String()

	if status != "true" {
		return "", nil
	}

	return content, nil
}
