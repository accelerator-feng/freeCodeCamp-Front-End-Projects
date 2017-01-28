$(function() {
    var $switch = $("#switch"),
        $count = $("h2"),
        $section = $("section"),
        $colorBlock = $section.find("div"),
        $audio = $("audio"),
        lightTimer = null,
        roundTimer = null,
        strict = 0, // strict模式指示
        order = [], // 亮灯顺序数组  
        clickCount = 0, // 点击计数
        orderCount = 0, // 亮灯计数
        lightCount = 0, // count区闪烁计数
        roundCount = 1; // 回合计数
    //    生成亮灯顺序数组
    function getOrder() {
        for (var i = 0; i < 20; i++) {
            var num = Math.round(Math.random() * 3);
            order.push(num);
        }
    }
    // count区闪烁，闪烁完后正式开始游戏
    function light() {
        lightCount++;
        $count.toggleClass('light');
        if (lightCount == 4) {
            clearInterval(lightTimer);
            lightCount = 0;
            if (roundCount > 9) { $count.text(roundCount); } else { $count.text("0" + roundCount); }
            roundTimer = setInterval(round, 1500);
        }
    }
    //  每回合顺序亮灯
    function round() {
        var index = order[orderCount];
        if (orderCount == roundCount) {
            //  亮灯完毕,玩家可以开始操作
            $audio.unbind();
            clearInterval(roundTimer);
            orderCount = 0;
            $section.removeClass('unclickable').addClass("clickable");
            return;
        }
        $colorBlock.eq(index).addClass('light');
        $audio[index].play();
        $audio[index].onended = function() {
            $colorBlock.removeClass("light");
            $audio[index].onended = null;
        };
        orderCount++;
    }
    $(".center").click(function(e) {
        var tg = e.target;
        // 游戏开关
        if (tg.id == "switch") {
            $(tg).toggleClass("on");
            $count.toggleClass("light");
            if (!$switch.attr("class")) {
                location.reload();
            }
        }
        if ($switch.attr("class")) {
            // strict模式
            if (tg.id == "strict") {
                $(".pilot-lamp").toggleClass("light");
                strict = 1;
            }
            // 游戏开始/重置
            else if (tg.id == "start") {
                order = [];
                clickCount = 0;
                orderCount = 0;
                lightCount = 0;
                roundCount = 1;
                $colorBlock.removeClass("light");
                clearInterval(roundTimer);
                clearInterval(lightTimer);
                getOrder();
                $count.text("- -");
                lightTimer = setInterval(light, 250);
            }
        }
    });
    $section.mousedown(function(e) {
        var id = e.target.id;
        $(e.target).addClass('light');
        if (id == order[clickCount]) {
            //  玩家点击正确
            $audio[id].play();
            clickCount++;
            if (clickCount == roundCount) {
                //  玩家胜利
                if (roundCount == 20) {
                    alert("YOU WIN");
                    location.reload();
                }
                //  玩家点完一轮
                clickCount = 0;
                roundCount++;
                if (roundCount > 9) { $count.text(roundCount); } else { $count.text("0" + roundCount); }
                roundTimer = setInterval(round, 1500);
            }
        } else {
            //  玩家点击错误
            $count.text("! !");
            $audio[3].play(); //  可替换成警告音效
            lightTimer = setInterval(light, 250);
            clickCount = 0;
            if (strict) { roundCount = 1; }
        }
    }).mouseup(function(e) {
        $(e.target).removeClass('light');
        // 玩家点完一轮且松开鼠标，禁用点击
        if (!clickCount) { $section.addClass("unclickable"); }
    });
});
