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
	AccessKey string //appid
	SecretKey string //秘钥
	AccountId string
}

const (
	BT_HOST        = "https://api.bithumb.com"
	BT_CONTENTTYPE = "application/x-www-form-urlencoded"
)

func (this *Bithumb) Depth(symbol string, num float64) (float64, float64, int64) {
	content, err := this.request(symbol)
	if err != nil {
		//停2秒再去获取
		time.Sleep(2 * time.Second)
		content, err = this.request(symbol)
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
	key := "data.transaction." + symbol + ".asks"
	data := gjson.Get(content, key).Array()
	index := len(data) - 1
	if index >= 0 {
		asks = data[index].Get("price").Float()
	}

	//买盘
	key = "data.transaction." + symbol + ".bids"
	data = gjson.Get(content, key).Array()
	if len(data) > 0 {
		bids = data[0].Get("price").Float()
	}

	ts := gjson.Get(content, "data.timestamp").Int()

	return bids, asks, ts
}

//行情数据 {currency} = BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM, BTG, EOS (基本值: BTC), ALL(全部
func (this *Bithumb) Depth2(symbol string, num float64) (float64, float64, int64) {

	path := fmt.Sprintf("/public/orderbook/%s?group_orders=%d&count=%d", symbol, 1, 20)

	content := this.publicRequest(path)
	//beego.Trace("韩国行情：", content)
	if content == "" {
		return 0, 0, 0
	}

	//卖盘
	data := gjson.Get(content, "data.asks").Array()
	asks := data[0].Get("price").Float()

	//买盘
	data = gjson.Get(content, "data.bids").Array()
	bids := data[0].Get("price").Float()

	ts := gjson.Get(content, "data.timestamp").Int()

	return bids, asks, ts

}

//获取账户信息
func (this *Bithumb) GetAccounts() string {
	if this.AccountId != "" {
		return this.AccountId
	}
	path := "/info/account"

	key := []string{"order_currency", "payment_currency"}
	value := []string{"BTC", "KRW"}
	content := this.privateRequest(path, key, value)
	//beego.Trace(content)
	if content == "" {
		return ""
	}

	this.AccountId = gjson.Get(content, "data.account_id").String()

	return this.AccountId

}

//获取资产
func (this *Bithumb) GetBalance() (map[string]float64, map[string]float64) {

	path := "/info/balance"
	key := []string{"currency"}
	value := []string{"ALL"}
	content := this.privateRequest(path, key, value)

	currency := []string{"KRW", "BTC", "DASH", "EOS", "ETC", "ETH", "LTC", "QTUM", "XRP", "ZEC", "BCH"}

	trade := make(map[string]float64)
	frozen := make(map[string]float64)
	for _, v := range currency {
		filed := fmt.Sprintf("data.in_use_%s", strings.ToLower(v))
		frozen[v] = gjson.Get(content, filed).Float()
		filed = fmt.Sprintf("data.available_%s", strings.ToLower(v))
		trade[v] = gjson.Get(content, filed).Float()
		if v == "KRW" {
			frozen["Money"] = frozen[v]
			trade["Money"] = trade[v]
		}
	}

	return trade, frozen

}

//获取钱包地址
func (this *Bithumb) GetWalletAddress() string {

	path := "/info/wallet_address"

	content := this.privateRequest(path, []string{}, []string{})

	return content
}

//获取订单列表
func (this *Bithumb) GetOrders() string {

	path := "/info/orders"
	key := []string{}
	value := []string{}
	content := this.privateRequest(path, key, value)

	return content

}

//创建订单
func (this *Bithumb) CreateOrder(price int64, amount float64, symbol, _type string) string {

	path := "/trade/place"
	key := []string{"order_currency", "Payment_currency", "units", "price", "type"}
	value := []string{symbol, "KRW", fmt.Sprintf("%.4f", amount), fmt.Sprintf("%d", price), _type}
	content := this.privateRequest(path, key, value)

	if content == "" {
		return ""
	}

	order_id := gjson.Get(content, "order_id").String()
	return order_id

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

	hmh := hmac.New(sha512.New, []byte(this.SecretKey))
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
	curl.SetTimeout(5*time.Second, 5*time.Second)

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
		beego.Trace(BT_HOST + path)
		return ""
	}

	return content

}

//网络请求
func (this *Bithumb) privateRequest(path string, key, value []string) string {

	//创建链接
	key = append(key, "endpoint")
	value = append(value, url.QueryEscape(path))

	//temp := []string{"order_currency=BTC", "payment_currency=KRW"}
	temp := []string{}
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
	curl.Header("Api-Key", this.AccessKey)
	curl.Header("Api-Sign", api_sign)
	curl.Header("Api-Nonce", api_nonce)
	curl.Header("Content-Type", BT_CONTENTTYPE)
	curl.Body(params)

	//设置超时时间 2秒链接，3秒读数据
	curl.SetTimeout(5*time.Second, 5*time.Second)

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

//web站点网络请求接口
func (this *Bithumb) request(coin string) (string, error) {

	curl := httplib.Post("https://www.bithumb.com/json/getTradeData")
	curl.Header("Cookie", "__cfduid=d98cfabc6b63125a253978b3c4b8544dc1499244132; layerBanner_fee=deny; wcs_bt=55c57830de52c4:1499246169; googtrans=/ko/ko; googtrans=/ko/ko; googtrans=/ko/ko; googtrans2=/ko/ko; _ga=GA1.2.171883503.1499244194; _gid=GA1.2.18948940.1499244194; xcoin_session=jAtWLJutDr%2BysLxQG%2B%2FpsGXgaYIaOWLwTKYeRbIJSpCJNcNJd9hTJGwQfeQKWqooextVHUOq4ZuDh6gGbWh1vdAccqRnjS96leBfAmE4ZDYedB3raGUVzu6UBepOa4ymMPRGuFi3r6bmRSfZCcSE07gvWKdzP5UXaoDFm27HtdIijiOIuYn01K%2F96s6uXhoUbG%2FRwdp51cMJd2Kl4rK3xLQPLewwPuR1SZUqiCP43GS1vY6Ra7wlSVrOUrQPL%2FgSDAoPSLdOOvFNJCV4RnxIf%2F5BX0n4Q%2BbCgSrjKxNtkG%2BjBEmbw5UD8TOn14InS1ZQNa8T7HotAm3WSgT6xwCeTGJCEbOLSIyAgbpaJjZ8X23TN0TRBucQNtFdGXj%2BCboKRyaTHS%2FG%2BRzOYL8yG1GoTFdqYBJltK0FUKcRgBlItHZ1vrhqO%2FOHFfJfxGxwBW4SrAAgd0PYfuabZwg60zuIISbpg%2FcmgbE%2FaZB7pWWO5oyv8BWjNknDOvTJYOyXyRex2jDsoZrW0GmRu0L89xs50clSzlF5dSHqyYCivcjuoiwx%2FY6r%2Bm9nPacsmP1TlVIHRFruU9v%2FUDMhxPcz6PNXhWR5uR6E%2F2Ym7Cj10e7NXFOaCALkyF0sFRbHhaN1HyLPswwVobo2mEA2pmd1dk0LoBs7Y9Y4MARPsuOgfm0GA7Kfra5KYvbioPXPedT8EMhfYQkb6ZYcJTQDpmXJrS2tT%2Byl5KSwdqkREoJzelPQ%2BalcxRn4ALJ83xdXcmMOAISBca%2FYw%2BinVhTEZIYStDQbLlRESnsG171SiCgusUyiUQ9WjgmGzv%2BBvMkVTuY8lXv8alzESc%2BEn1gqA1SRhzr12BcpcfqAWAcOEJsGyMyTWdAxagFwCAMd1R7AFuo2Mc5b0tWP0polUP%2F7XRfLB6fFzD5sYdlnyu5VoEpAJhlSQgtcXqJohqwKy12XXxNbzQD6Y6hpF52oHBLBZOY5RDeCQGisb%2BRtKB9h2l6SGGJXoPjwuswN%2BYYWVZcC6xxyoiOqYKvpBryhy3a0o3Lsxsdpos5X9RshsSPphD0uUYKvc%2FMv0688%2FGq%2B2WAVoyWWCNWFe6GFo4wFYF5Z4QUH%2F%2BSfSS2VMOZI1g6LGrO%2F5TickOvZOdPr0LC5Z5tomTv2uOcDFVjQ8AyLaK2ueeLxIeK%2FXGQKX0Q325%2Bb8AcG9T8t8v6EfievKyKgviYY57X6GgSQawpvDA8Oi9V%2FU6l9CbwTinRxyH1%2B5PKQZhFmEmVopDmptPqVCLNSorgdQJcA5Jw0Si0lxdOUzD2G4diXGPVYqaJWZdBA3NBevrkAp1nyQa9JNss%2FavvtuENX0qhpg8%2FJaM%2FKXB66PgH182w3L4xqYjRVYvdpg5V5XxdA5s6raBmLyc%2FkWHs1Ng9tgD1QTK5mZbTBHPM%2BvuqVF%2Bc0yZMVN2Xpb9xC7ED%2FHx2pcurhy2DZuvLjl9Uax1WOcIfyUVHSGG8CkqRfyxaQEsaK23f%2BBvV6PQtHhqQyFPeaeXJgiQ%2F3K4P5A5jDzbWVMKcL3UhJK7NHURTbtgD7Ag%2F51tC0EuLCQs0lEM2HzJIsDMyVXkMt9U%2Fo%2FG6%2ByriM4cfyPt6ps4nd4EzvknFix0mzooMTz2Gw4CLwg8%2BXmIVflweiZ5F3yqxiBIx6jDIF2%2B%2BglqvXTsjcs7%2Fi%2FkvX5fN2XPknnTukZ3qu9g7lnnNMSHPYjG7PmD%2BBWwotc4nxvvEXQ%2B44o9RS18Yq8%2BeMGO8wrL8%2B6omMiVqKEZ4SrpvkR5hW7Ns%2FOn6wD03CAGtKbS8i0%2Bc1wQZDqDC%2FlJ7S2TSL22ix7mSIKoAR5NDsK2GF2KKTONqklWCjZPV6FWift1f617Vzw%2BbtOY4C0KmwLpC0ecGorctc1QI9wulcZQFNF%2BikQZA%2Fah6eKfUYIIk0g%2BEj5iSa65OQAPnHi2W39BMhejLUGXpVUElNs%2FD5wHo2rErL8Fg%3Da2f71f3f37998856bab8d5106505bb2000e4ae82; csrf_xcoin_name=582389085a27f23f5f43e31f6e39eae9")

	curl.Header("x-requested-with", "XMLHttpRequest")
	curl.Header("Origin", "https://www.bithumb.com")
	curl.Header("Referer", "https://www.bithumb.com/u2/US251")
	curl.Header("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36")

	curl.Param("type", "trade")
	curl.Param("coin", coin)
	curl.Param("actDb", "N")
	curl.Param("csrf_xcoin_name", "582389085a27f23f5f43e31f6e39eae9")

	//获取请求的内容
	temp, err := curl.Bytes()
	if err != nil {
		return "", err
	}

	content := string(temp)

	status := gjson.Get(content, "status").String()

	if status != "0000" {
		err_msg := gjson.Get(content, "message").String()
		beego.Error(err_msg)

		return "", nil
	}

	return content, nil

}

func microsectime() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}
