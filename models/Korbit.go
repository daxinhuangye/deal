package models

import (
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

//Korbit api接口
type Korbit struct {
	AccessKey string //appid
	SecretKey string //秘钥
	AccountId string
}

const (
	KB_HOST        = "api.korbit.co.kr"
	KB_CONTENTTYPE = "application/x-www-form-urlencoded"
	KB_ACCEPT      = "application/json"
	KB_LANGUAGE    = "zh-CN"
	KB_AGENT       = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0"
)

//行情数据 btcusdt
func (this *Korbit) Depth(symbol string, num float64) (float64, float64, int64) {

	api := "https://" + KB_HOST + "/v1/orderbook?currency_pair=" + symbol

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
	tick := gjson.Get(content, "asks").Array()
	temp := tick[0].Array()
	asks := temp[0].Float()

	//买盘
	tick = gjson.Get(content, "bids").Array()
	temp = tick[0].Array()
	bids := temp[0].Float()

	//时间
	ts := gjson.Get(content, "timestamp").Int()

	return bids, asks, ts

}

//网络请求
func (this *Korbit) request(api string, fields ...interface{}) (string, error) {

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
	status := gjson.Get(content, "timestamp").Int()

	if status == 0 {
		return "", nil
	}

	return content, nil
}
