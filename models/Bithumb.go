package models

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"net/url"
	"strings"
	"time"
	"tsEngine/tsCrypto"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/tidwall/gjson"
)

//韩国交易平台api接口
type Bithumb struct {
	Rate float64 //汇率
	Fee  float64 //手续费
}

const (
	BT_HOST        = "https://api.bithumb.com"
	BT_CONTENTTYPE = "application/x-www-form-urlencoded"
)

//行情数据 {currency} = BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM, BTG, EOS (基本值: BTC), ALL(全部
func (this *Bithumb) Depth(symbol string, num float64) (float64, float64) {

	path := fmt.Sprintf("/public/orderbook/%s?group_orders=%d&count=%d", symbol, 1, 20)

	content := this.publicRequest(path)
	beego.Trace("韩国行情：", content)
	if content == "" {
		return 0, 0
	}

	var total, buy, sell float64
	//卖盘
	asks := gjson.Get(content, "data.asks").Array()
	for _, v := range asks {
		total += v.Get("quantity").Float()
		if total >= num {
			buy = v.Get("price").Float()
		}

	}

	total = 0

	//买盘
	bids := gjson.Get(content, "data.bids").Array()

	for k, v := range bids {
		if k == 0 {
			sell = v.Get("price").Float()
		}
		total += v.Get("quantity").Float()

	}
	if total < num {
		sell = 0
	}
	return buy, sell

}

//获取账户信息
func (this *Bithumb) GetAccounts() string {
	path := "/info/account"

	content := this.privateRequest(path, []string{}, []string{})

	if content == "" {
		return ""
	}

	account_id := gjson.Get(content, "data.account_id").String()
	return account_id

}

//获取资产
func (this *Bithumb) GetBalance() string {

	path := "/info/balance"

	content := this.privateRequest(path, []string{}, []string{})
	if content == "" {
		return ""
	}

	account_id := gjson.Get(content, "data.account_id").String()
	return account_id

}

//获取钱包地址
func GetWalletAddress(this *Bithumb) string {

	path := "/info/wallet_address"

	content := this.privateRequest(path, []string{}, []string{})

	return content
}

//获取订单列表
func (this *Bithumb) GetOrders(symbol, types, start_date, end_date, states, from, direct, size string) string {

	/*
		path := "/v1/order/orders"

		params := []string{"symbol=" + symbol, "types=" + types, "start-date=" + start_date, "end-date=" + end_date, "states=" + states, "from=" + from, "direct=" + direct, "size=" + size}

		return this.privateRequest(path, params)
	*/
	return ""
}

//创建订单
func (this *Bithumb) CreateOrder(amount, source, symbol, _type, price string) string {

	path := "/trade/place"

	content := this.privateRequest(path, []string{}, []string{})

	return content

}

//取消订单
func (this *Bithumb) CancelOrder(order_id string) string {

	path := "/trade/cancel"

	content := this.privateRequest(path, []string{}, []string{})

	return content
}

//订单信息
func (this *Bithumb) OrderInfo(order_id string) string {
	path := "/info/order_detail"

	content := this.privateRequest(path, []string{}, []string{})
	data := gjson.Get(content, "data").Array()
	for _, v := range data {
		if order_id == v.Get("order_id").String() {
			return v.Get("status").String()
		}
	}
	return content
}

//订单是否成交
func (this *Bithumb) OrderDeal(order_id string) bool {
	for {
		if this.OrderInfo(order_id) == "filled" {
			return true
		}
	}
	return false
}

//虚拟币提现
func (this *Bithumb) GetWithdraw(address_id, amount, currency, fee, addr_tag string) string {
	path := "/trade/btc_withdrawal"

	content := this.privateRequest(path, []string{}, []string{})

	return content
}

//取消提现
func (this *Bithumb) CancelWithdraw(address_id string) string {

	return ""

}

//签名计算
func (this *Bithumb) createSign(hmac_data string) string {

	hmh := hmac.New(sha512.New, []byte(beego.AppConfig.String("BithumbSecretKey")))
	hmh.Write([]byte(hmac_data))

	hex_data := hex.EncodeToString(hmh.Sum(nil))

	hmh.Reset()

	sign := tsCrypto.Base64Encode(hex_data)

	return sign

}

//公共接口网络请求
func (this *Bithumb) publicRequest(path string) string {

	curl := httplib.Get(BT_HOST + path)

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

	if status != "0000" {
		err_msg := gjson.Get(content, "message").String()
		beego.Error(err_msg)
		return ""
	}

	return content

}

//网络请求
func (this *Bithumb) privateRequest(path string, key, value []string) string {

	//创建链接
	key = append(key, "endpoint")
	value = append(value, url.QueryEscape(path))

	temp := []string{"order_currency=BTC", "payment_currency=KRW"}
	for k, v := range key {
		temp = append(temp, v+"="+value[k])
	}
	params := strings.Join(temp, "&")

	nonce_int64 := microsectime()
	api_nonce := fmt.Sprint(nonce_int64)

	// Api-Sign information generation.
	hmac_data := path + string(0) + params + string(0) + api_nonce
	api_sign := this.createSign(hmac_data)

	curl := httplib.Post(BT_HOST + path)
	curl.Header("Api-Key", beego.AppConfig.String("BithumbAccessKey"))
	curl.Header("Api-Sign", api_sign)
	curl.Header("Api-Nonce", api_nonce)
	curl.Header("Content-Type", BT_CONTENTTYPE)
	curl.Body(params)

	//设置超时时间 2秒链接，3秒读数据
	curl.SetTimeout(3*time.Second, 3*time.Second)

	//获取请求的内容
	data, err := curl.Bytes()
	if err != nil {
		beego.Error(err)
		return ""
	}
	content := string(data)

	status := gjson.Get(content, "status").String()

	if status != "0000" {
		err_msg := gjson.Get(content, "message").String()
		beego.Error(err_msg)
		return ""
	}

	return content
}

func microsectime() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}
