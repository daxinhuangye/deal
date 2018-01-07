package models

import (
	"fmt"
	_ "reflect"
	"strings"
	"time"

	"crypto/hmac"
	"crypto/sha256"

	"sort"
	"tsEngine/tsTime"

	_ "encoding/hex"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
	"net/url"
	"tsEngine/tsCrypto"
)

//火币api接口
type Huobi struct {
	Rate float64 //汇率
	Fee  float64 //手续费
}

const (
	HB_HOST        = "api.huobi.pro"
	HB_CONTENTTYPE = "application/x-www-form-urlencoded"
	HB_ACCEPT      = "application/json"
	HB_LANGUAGE    = "zh-CN"
	HB_AGENT       = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0"
)

//行情数据 btcusdt
func (this *Huobi) Depth(symbol string, num float64) (float64, float64) {

	api := "https://" + HB_HOST + "/market/depth?type=step5&symbol=" + symbol

	content := this.request(api, []string{}, []string{})
	if content == "" {
		return 0, 0
	}

	var total, buy, sell float64
	//卖盘
	asks := gjson.Get(content, "tick.asks").Array()
	for _, v := range asks {
		temp := v.Array()
		total += temp[1].Float()
		if total >= num {
			buy = temp[0].Float() * this.Rate
			break
		}

	}

	total = 0

	//买盘
	bids := gjson.Get(content, "tick.bids").Array()

	for k, v := range bids {
		temp := v.Array()
		if k == 0 {
			sell = temp[0].Float() * this.Rate
		}
		total += temp[1].Float()

	}
	if total < num {
		sell = 0
	}
	return buy, sell

}

//获取账户信息
func (this *Huobi) GetAccounts() string {

	params := []string{}
	content := this.keyGet("/v1/account/accounts", params)

	return content

}

//获取资产
func (this *Huobi) GetBalance() string {

	account_id := beego.AppConfig.String("HuobiAccountId")

	path := fmt.Sprintf("/v1/account/accounts/%s/balance", account_id)

	params := []string{"account-id=" + account_id}

	return this.keyGet(path, params)

}

//获取钱包地址
func (this *Huobi) GetWalletAddress() string {
	wallet_address := beego.AppConfig.String("HuobiWalletAddress")
	return wallet_address
}

//获取订单列表
func (this *Huobi) GetOrders(symbol, types, start_date, end_date, states, from, direct, size string) string {

	path := "/v1/order/orders"

	params := []string{"symbol=" + symbol, "types=" + types, "start-date=" + start_date, "end-date=" + end_date, "states=" + states, "from=" + from, "direct=" + direct, "size=" + size}

	return this.keyGet(path, params)

}

//创建订单
func (this *Huobi) CreateOrder(account_id string, amount, price float64, symbol, _type string) string {

	post_key := []string{"account-id", "amount", "price", "symbol", "type", "source"}
	post_value := []string{account_id, fmt.Sprintf("%f", amount), fmt.Sprintf("%f", price), symbol, _type, "api"}

	path := "/v1/order/orders/place"

	content := this.keyPost(path, post_key, post_value)
	if content == "" {
		return ""
	}

	status := gjson.Get(content, "status").String()
	if status != "ok" {
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}
	order_id := gjson.Get(content, "data").String()
	return order_id
}

//申请取消订单
func (this *Huobi) CancelOrder(order_id string) string {

	path := fmt.Sprintf("/v1/order/orders/%s/submitcancel", order_id)
	content := this.keyPost(path, []string{}, []string{})
	if content == "" {
		return ""
	}

	data := gjson.Get(content, "data").String()
	return data

}

//订单信息
func (this *Huobi) OrderInfo(order_id string) string {
	params := []string{}
	path := fmt.Sprintf("/v1/order/orders/%s", order_id)
	content := this.keyGet(path, params)

	if content == "" {
		return ""
	}

	status := gjson.Get(content, "status").String()
	if status != "ok" {
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}
	state := gjson.Get(content, "data.state").String()
	return state
}

//订单是否成交
func (this *Huobi) OrderDeal(order_id string) bool {
	for {
		if this.OrderInfo(order_id) == "filled" {
			return true
		}
	}

	return false
}

//虚拟币提现
func (this *Huobi) GetWithdraw(address_id, amount, currency, fee, addr_tag string) string {
	post_key := []string{"address_id", "amount", "currency", "fee", "addr-tag"}
	post_value := []string{address_id, amount, currency, fee, addr_tag}
	path := "/v1/dw/withdraw/api/create"
	return this.keyPost(path, post_key, post_value)
}

//取消提现
func (this *Huobi) CancelWithdraw(address_id string) string {

	path := fmt.Sprintf("/v1/dw/withdraw-virtual/%s/cancel", address_id)
	return this.keyPost(path, []string{}, []string{})

}

//使用get方式调用接口
func (this *Huobi) keyGet(path string, params []string) string {

	api := "https://" + HB_HOST + path + "?"

	params = append(params, "SignatureMethod=HmacSHA256")
	params = append(params, "SignatureVersion=2")
	params = append(params, "Timestamp="+url.QueryEscape(tsTime.CurrSeUtcFormat("2006-01-02T15:04:05")))
	params = append(params, "AccessKeyId="+beego.AppConfig.String("HuobiAccessKey"))
	params = append(params, "Signature="+this.createSign("GET", path, params))

	api += strings.Join(params, "&")
	return this.request(api, []string{}, []string{})

}

//使用post方式调用接口
func (this *Huobi) keyPost(path string, key, value []string) string {
	api := "https://" + HB_HOST + path + "?"

	params := []string{}
	for k, v := range key {
		params = append(params, v+"="+value[k])
	}

	params = append(params, "SignatureMethod=HmacSHA256")
	params = append(params, "SignatureVersion=2")
	params = append(params, "Timestamp="+url.QueryEscape(tsTime.CurrSeUtcFormat("2006-01-02T15:04:05")))
	params = append(params, "AccessKeyId="+beego.AppConfig.String("HuobiAccessKey"))
	params = append(params, "Signature="+this.createSign("POST", path, params))

	api += strings.Join(params, "&")
	return this.request(api, key, value)

}

//签名计算
func (this *Huobi) createSign(method, path string, params []string) string {

	sort.Strings(params)
	str := strings.Join(params, "&")
	temp := []string{method, HB_HOST, path, str}
	hmac_data := strings.Join(temp, "\n")
	hmh := hmac.New(sha256.New, []byte(beego.AppConfig.String("HuobiSecretKey")))

	hmh.Write([]byte(hmac_data))
	hex_data := string(hmh.Sum(nil))
	hmh.Reset()
	sign := tsCrypto.Base64Encode(hex_data)
	sign = url.QueryEscape(sign)
	beego.Trace(sign)
	return sign

}

//网络请求
func (this *Huobi) request(api string, key, value []string) string {

	//创建链接
	curl := httplib.Get(api)
	curl.Header("Content-type", HB_CONTENTTYPE)

	if len(key) > 0 {
		curl = httplib.Post(api)
		curl.Header("Content-type", HB_ACCEPT)
		for k, v := range key {
			curl.Param(v, value[k])
		}
	}

	curl.Header("Accept", HB_ACCEPT)
	curl.Header("User-Agent", HB_AGENT)
	curl.Header("Accept-Language", HB_LANGUAGE)
	//设置超时时间 2秒链接，3秒读数据
	curl.SetTimeout(3*time.Second, 3*time.Second)

	//获取请求的内容
	temp, err := curl.Bytes()
	if err != nil {
		beego.Error(err)
		return ""
	}
	content := string(temp)
	status := gjson.Get(content, "status").String()
	if status != "ok" {
		beego.Trace(content)
		beego.Trace(api)
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}

	return content
}
