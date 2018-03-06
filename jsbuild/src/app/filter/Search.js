/**
 * Created by Administrator on 2018/3/1.
 */
app.filter('search', [function() {
    return function(array, where) {

        var output = [];
        var timestamp = Date.parse( new Date()) ;
        var expired = 60000;
        if(angular.isDefined(where)){
            expired = where.expired * 1000;
        }

        angular.forEach(array, function (item) {
            //时间错过滤
            if ((timestamp - item.timestamp) < expired ){
                //币种是否满足条件
                if (angular.isDefined(where.symbol[item.symbol]) && where.symbol[item.symbol]) {
                    //主站是否满足条件
                    if (angular.isDefined(where.platformA[item.platformA]) && where.platformA[item.platformA]) {
						//次站是否满足条件
                        if (angular.isDefined(where.platformB[item.platformB]) && where.platformB[item.platformB]) {
                            item.msg =  ((timestamp - item.timestamp) / 1000).toFixed(0) + " 秒前";
                            output.push(item);
                        }
                    }
                }
            }


        });
        return output;
    };
}]);
