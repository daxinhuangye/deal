package models

import (
	"time"

	"tsEngine/tsTime"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

//Coinone api接口
type Coinone struct {
	AccessKey string //appid
	SecretKey string //秘钥
	AccountId string
}

//币安api接口

const (
	CO_HOST        = "api.coinone.co.kr"
	CO_CONTENTTYPE = "application/x-www-form-urlencoded"
	CO_ACCEPT      = "application/json"
	CO_LANGUAGE    = "zh-CN"
	CO_AGENT       = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0"
)

//行情数据 btcusdt
func (this *Coinone) Depth(symbol string, num float64) (float64, float64, int64) {

	api := "https://" + CO_HOST + "/orderbook/?currency=" + symbol + "&format=json"

	//预设时间
	ts := int64(tsTime.CurrMs())

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
	//卖盘
	tick := gjson.Get(content, "ask").Array()
	asks := tick[0].Get("price").Float()

	//买盘
	tick = gjson.Get(content, "bid").Array()
	bids := tick[0].Get("price").Float()

	//时间
	timestamp := gjson.Get(content, "timestamp").Int()

	if ts > 0 {
		ts = timestamp
	}
	return bids, asks, ts

}

//网络请求
func (this *Coinone) request(api string, fields ...interface{}) (string, error) {

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
	status := gjson.Get(content, "errorCode").String()

	if status != "0" {
		err_msg := gjson.Get(content, "errorMsg").String()
		beego.Error(err_msg)
		return "", nil
	}

	return content, nil
}
