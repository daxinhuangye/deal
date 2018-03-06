/**
 * Created by Administrator on 2018/2/27.
 */
app.service('SymbolService', ["$rootScope", "$http", "$filter", "appCfg", function($rootScope, $http, $filter, appCfg) {
    var self = this;

    this.data = {
        "Items":[]
    };

    this.getData = function() {
        var url = appCfg.AppPrefix + "/apppub/symbol";

        $http.get(url).success(function(data, status, headers, config) {
                if($filter("CheckError")(data)){
                    self.data.Items = data.Data;
                }
            })
            .error(function(data, status, headers, config) {

            });
    };

    this.getData();
}]);

