package models

import (
	"crypto/hmac"
	"crypto/sha256"
	_ "encoding/hex"
	"fmt"
	"net/url"
	_ "reflect"
	"sort"
	"strings"
	"time"
	"tsEngine/tsCrypto"
	"tsEngine/tsTime"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

//火币api接口
type Huobi struct {
	AccessKey string //appid
	SecretKey string //秘钥
	AccountId string
}

//火币api接口

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
	//beego.Trace("huobiApi:", api)
	content := this.request(api)
	//beego.Trace("返回值：", content)
	if content == "" {
		return 0, 0
	}

	var total, buy, sell float64
	//卖盘里算买入的钱
	asks := gjson.Get(content, "tick.asks").Array()
	for _, v := range asks {
		temp := v.Array()
		total += temp[1].Float()
		if total >= num {
			buy = temp[0].Float()
			break
		}

	}

	total = 0

	//买盘里算卖的钱
	bids := gjson.Get(content, "tick.bids").Array()

	for _, v := range bids {
		temp := v.Array()
		total += temp[1].Float()
		if total >= num {
			sell = temp[0].Float()
			break
		}

	}

	return buy, sell

}

//获取账户信息
func (this *Huobi) GetSymbols() string {
	path := "/v1/common/symbols"
	params := []string{}
	api := "https://" + HB_HOST + path + "?" + this.createSign("GET", path, params)

	return this.request(api)

}

//获取账户信息
func (this *Huobi) GetAccounts() string {
	if this.AccountId != "" {
		return this.AccountId
	}
	path := "/v1/account/accounts"
	params := []string{}
	api := "https://" + HB_HOST + path + "?" + this.createSign("GET", path, params)

	return this.request(api)

}

//获取资产
func (this *Huobi) GetBalance() (map[string]float64, map[string]float64) {

	account_id := beego.AppConfig.String("HuobiAccountId")

	path := fmt.Sprintf("/v1/account/accounts/%s/balance", account_id)

	params := []string{"account-id=" + account_id}

	api := "https://" + HB_HOST + path + "?" + this.createSign("GET", path, params)

	content := this.request(api)

	beego.Trace(content)

	list := gjson.Get(content, "data.list").Array()

	trade := make(map[string]float64)
	frozen := make(map[string]float64)

	for _, v := range list {
		currency := strings.ToUpper(v.Get("currency").String())
		if currency == "USDT" {
			currency = "Money"
		}
		if v.Get("type").String() == "trade" {
			trade[currency] += v.Get("balance").Float()
		} else {
			frozen[currency] += v.Get("balance").Float()
		}

	}

	return trade, frozen

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

	api := "https://" + HB_HOST + path + "?" + this.createSign("GET", path, params)

	return this.request(api)

}

//创建订单
func (this *Huobi) CreateOrder(price, amount float64, symbol, _type string, PricePrecision, AmountPrecision int64) string {

	var postData struct {
		AccountId string `json:"account-id"`
		Price     string `json:"price"`
		Amount    string `json:"amount"`
		Source    string `json:"source"`
		Type      string `json:"type"`
		Symbol    string `json:"symbol"`
	}

	postData.AccountId = this.GetAccounts()
	//设置精度
	price_format := "%." + fmt.Sprintf("%d", PricePrecision) + "f"
	amount_format := "%." + fmt.Sprintf("%d", AmountPrecision) + "f"
	postData.Price = fmt.Sprintf(price_format, price)
	postData.Amount = fmt.Sprintf(amount_format, amount)
	postData.Symbol = symbol
	postData.Source = "api"
	postData.Type = _type

	path := "/v1/order/orders/place"

	api := "https://" + HB_HOST + path + "?" + this.createSign("POST", path, []string{})

	content := this.request(api, postData)

	if content == "" {
		return ""
	}

	order_id := gjson.Get(content, "data").String()
	return order_id
}

//申请取消订单
func (this *Huobi) CancelOrder(order_id string) string {
	//定义匿名数据结构
	var postData struct {
		OrderId string `json:"data"`
	}
	postData.OrderId = order_id

	path := fmt.Sprintf("/v1/order/orders/%s/submitcancel", order_id)
	api := "https://" + HB_HOST + path + "?" + this.createSign("POST", path, []string{})

	content := this.request(api, postData)
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

	api := "https://" + HB_HOST + path + "?" + this.createSign("GET", path, params)

	content := this.request(api)
	//beego.Trace("订单信息", content)
	if content == "" {
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
	/*
		post_key := []string{"address_id", "amount", "currency", "fee", "addr-tag"}
		post_value := []string{address_id, amount, currency, fee, addr_tag}
		path := "/v1/dw/withdraw/api/create"
		return this.keyPost(path, post_key, post_value)
	*/
	return ""
}

//取消提现
func (this *Huobi) CancelWithdraw(address_id string) string {
	/*
		path := fmt.Sprintf("/v1/dw/withdraw-virtual/%s/cancel", address_id)
		return this.keyPost(path, []string{}, []string{})
	*/
	return ""

}

//签名计算
func (this *Huobi) createSign(method, path string, params []string) string {

	params = append(params, "SignatureMethod=HmacSHA256")
	params = append(params, "SignatureVersion=2")
	params = append(params, "Timestamp="+url.QueryEscape(tsTime.CurrSeUtcFormat("2006-01-02T15:04:05")))
	params = append(params, "AccessKeyId="+beego.AppConfig.String("HuobiAccessKey"))

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

	params = append(params, "Signature="+sign)
	str = strings.Join(params, "&")
	return str

}

//网络请求
func (this *Huobi) request(api string, fields ...interface{}) string {

	//创建链接
	curl := httplib.Get(api)

	if len(fields) > 0 {
		curl = httplib.Post(api)
		curl.JSONBody(fields[0])
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
		//beego.Trace(content)
		//beego.Trace(api)
		err_msg := gjson.Get(content, "err-msg").String()
		beego.Error(err_msg)
		return ""
	}

	return content
}
