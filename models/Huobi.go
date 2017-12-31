package models

import (
	_ "fmt"
	_ "reflect"
	_ "strings"
	"time"

	_ "crypto/hmac"
	_ "crypto/sha256"

	"sort"
	"tsEngine/tsTime"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

//火币api接口
type Huobi struct {
}

const (
	API_HOST    = "https://api.huobi.pro"
	API_MARKET  = "https://api.huobi.pro/market"
	API_V1      = "https://api.huobi.pro/v1"
	ContentType = "application/x-www-form-urlencoded"
	Accept      = "application/json"
	Language    = "zh-CN"
	Agent       = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
)

//行情数据
func (this *Huobi) Depth() string {
	api := API_MARKET + "/depth?type=step5&symbol=btcusdt"

	content, err := this.request(api, []string{}, []string{})
	if err != nil {
		beego.Error(err)
		return ""
	}
	beego.Trace(content)
	status := gjson.Get(content, "status").String()
	if status != "ok" {
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}
	return string(content)
}

//获取账户信息
func (this *Huobi) GetAccounts() string {
	//method := "GET"
	timstamp := tsTime.CurrSeFormat("2006-01-02T15:04:05")

	api := API_V1 + "/account/accounts?"
	api += "AccessKeyId=" + beego.AppConfig.String("HuobiAccessKey")
	api += "&SignatureMethod=HmacSHA256"
	api += "&SignatureVersion=2"
	api += "&Timestamp=" + timstamp
	beego.Trace(api)
	return api

}

//获取资产
func (this *Huobi) GetBalance() string {
	return ""
}

//创建订单
func (this *Huobi) CreateOrder() string {
	return ""
}

//取消订单
func (this *Huobi) CancelOrder() string {
	return ""
}

//订单信息
func (this *Huobi) OrderInfo() string {
	return ""
}

//虚拟币提现
func (this *Huobi) GetWithdraw() string {
	return ""
}

//取消提现
func (this *Huobi) CancelWithdraw() string {
	return ""
}

func (this *Huobi) Trade() string {
	api := API_MARKET + "/trade?symbol=btcusdt"

	content, err := this.request(api, []string{}, []string{})
	if err != nil {
		beego.Error(err)
		return ""
	}
	beego.Trace(content)
	status := gjson.Get(content, "status").String()
	if status != "ok" {
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}
	tick_data := gjson.Get(content, "tick.data").Array()

	beego.Trace(tick_data)
	amount := tick_data[0].Get("amount").Float()
	beego.Trace(amount)
	return string(content)
}

//签名计算
func (this *Huobi) createSign(method string) {

}

//网络请求
func (this *Huobi) request(api string, key, value []string) (string, error) {

	//创建链接
	curl := httplib.Get(api)
	curl.Header("Content-type", "application/x-www-form-urlencoded")

	if len(key) > 0 {
		curl = httplib.Post(api)
		curl.Header("Content-type", Accept)
		for k, v := range key {
			curl.Param(v, value[k])
		}
	}

	curl.Header("Accept", Accept)

	curl.Header("User-Agent", Agent)
	curl.Header("Accept-Language", Language)
	//设置超时时间 2秒链接，3秒读数据
	curl.SetTimeout(1*time.Second, 1*time.Second)

	//获取请求的内容
	content, err := curl.Bytes()
	if err != nil {
		return "", err
	}
	return string(content), err
}
