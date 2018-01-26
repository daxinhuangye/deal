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
                    self.data.Items = angular.fromJson(data.Data);
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

