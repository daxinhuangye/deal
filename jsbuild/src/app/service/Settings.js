/**
 * Created by Administrator on 2018/1/26.
 */
app.service('SettingsService', ["$rootScope", "$http", "$filter", "appCfg", "EzConfirm", function($rootScope, $http, $filter, appCfg, EzConfirm) {
    var self = this;

    this.data = {
        "Items":{
            }
    };

    this.getData = function() {
        var url = appCfg.AppPrefix + "/settings/view";

        $http.get(url).success(function(data, status, headers, config) {
                if($filter("CheckError")(data)){
                    var temp = angular.fromJson(data.Data);
                    for(var i=1; i<=9;i++){
                        if (angular.isUndefined(temp.rate[i])){
                            temp.rate[i] = 1;
                        }
                        if (angular.isUndefined(temp.symbol[i])){
                            temp.symbol[i] = {
                                "BTC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ETH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "DASH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "LTC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ETC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "XRP": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "BCH": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "ZEC": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "QTUM": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                },
                                "EOS": {
                                    "fee": 0.2,
                                    "transfer": 0.001,
                                    "amount": 0.3
                                }
                            };
                        }
                    }
                    self.data.Items = temp;
                }
            }) .error(function(data, status, headers, config) {

            });
    };

    this.save = function(){
        var url = appCfg.AppPrefix + "/settings/edit";
        var post = {"Data":angular.toJson(self.data.Items)};
        $http.post(url, post).success(function(data, status, headers, config) {
            if($filter("CheckError")(data)){
                EzConfirm.create({heading: '系统提示', text: "操作成功", cancelBtn:'',confirmBtn:'知道了'});
            }
        });
    }


    this.getData();
}]);

