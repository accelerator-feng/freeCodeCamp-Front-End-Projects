$(function() {
    var myCity = new BMap.LocalCity();
    myCity.get(function(r) {
        var cityname = r.name;
        $(".city").text(cityname);
        getWeather(cityname);
    });

    function getWeather(cityname) {
        $.getJSON("https://v.juhe.cn/weather/index?callback=?", {
            "cityname": cityname,
            "dtype": "jsonp",
            "key": "12787276c08fd9a6d9c249a6189f59d9"
        }, function(data) {
            var sk = data.result.sk;
            var skList = [];
            var today = data.result.today;
            var todayList = [];
            for (var skPro in sk) { skList.push(sk[skPro]); }
            $(".temp").text(skList[0] + "℃");
            $(".wind_direction").text(skList[1]);
            $(".wind_strengt").text(skList[2]);
            $(".humidity").text(skList[3]);
            $(".time").text(skList[4]);
            for (var todayPro in today) { todayList.push(today[todayPro]); }
            $(".temperature").text(todayList[0]);
            $(".wind").text(todayList[3]);
            $(".weather").text(todayList[1]);
            $(".dressing_index").text(todayList[7]);
            $(".uv_index").text(todayList[9]);
            $(".date_y").text(todayList[6]);
            $("body").show();
        });
    }
});
