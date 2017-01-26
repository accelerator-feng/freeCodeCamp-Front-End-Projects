$(function() {
    var time = $(".clock p"),
        sessionTime = $(".session .number"),
        breakTime = $(".break .number"),
        secs = 1500,
        timer = null,
        mark = 1,
        origin = "",
        cache = null;

    function showTime() {
        var h = Math.floor(secs / 3600);
        var m = Math.floor(secs % 3600 / 60); 
        var s = Math.floor(secs % 3600 % 60);
        secs -= 1;
        if (secs === -1 && mark === 1) {
            mark = 2;
            secs = breakTime.text() * 60;
            cache = null;
            origin = secs;
            $("h2").text("Break!");
            $(".background").css("background", "#f44");
        } else if (secs === -1 && mark === 2) {
            mark = 1;
            secs =sessionTime.text() * 60;
            cache = null;
            origin = secs;
            $("h2").text("Session");
            $(".background").css("background", "#9c0");
        }
        var height = (1 - secs / origin) * 310 + "px";
        $(".background").css("height", height);
        return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    function countdown() { time.text(showTime()); }
    $("body").click(function(e) {
        var tg = $(e.target);
        switch (tg.attr("class")) {
            case "plus":
                if (!timer) {
                    var originPlus = parseInt(tg.prev().text()) + 1;
                    tg.prev().text(originPlus);
                    if (tg.attr("id") === "right_plus" && mark === 1) {
                        time.text(sessionTime.text());
                        secs = sessionTime.text() * 60;
                        cache = null;
                    }
                    if (tg.attr("id") === "left_plus" && mark === 2) {
                        time.text(breakTime.text());
                        secs = breakTime.text() * 60;
                        cache = null;
                    }
                }
                break;
            case "minus":
                if (!timer) {
                    var originMinus = parseInt(tg.next().text()) - 1;
                    originMinus === 0 ? a.next().text(1) : tg.next().text(originMinus);
                    if (tg.attr("id") === "right_minus" && mark === 1) {
                        time.text(sessionTime.text());
                        secs = sessionTime.text() * 60;
                        cache = null;
                    }
                    if (tg.attr("id") === "left_minus" && mark === 2) {
                        time.text(breakTime.text());
                        secs = breakTime.text() * 60;
                        cache = null;
                    }                   
                }
                break;
            case "h2":
            case "clock":
            case "time":
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                    cache = origin;
                } else {
                    origin = cache || secs;
                    countdown();
                    timer = setInterval(countdown, 1000);
                }
                break;
        }
    });
});
