$(function() {
    var $switch = $("#switch"),
        $count = $("h2"),
        $section = $("section"),
        $colorBlock = $section.find("div"),
        $audio = $("audio"),
        game = {
            strict: 0, // 严格模式指示  
            roundTimer: null,
            flickerTimer: null,  
            reset: function() {
                this.clickCount=0; // 点击次数
                this.roundCount=1; // COUNT计数
                this.order = getOrder(); // 亮灯顺序
                clearInterval(this.roundTimer);
                clearInterval(this.flickerTimer);
            }
        };

    function getOrder() {
        var lightOrder = [];
        for (var i = 0; i < 20; i++) {
            var num = Math.round(Math.random() * 3);
            lightOrder.push(num);
        }
        return lightOrder;
    }
    // count区闪烁，闪烁完后正式开始游戏
    function flicker() {
        var lightCount = 0,
            light = function() {
                lightCount++;
                $count.toggleClass('light');
                if (lightCount == 4) {
                    clearInterval(game.flickerTimer);
                    if (game.roundCount > 9) { $count.text(game.roundCount); } else { $count.text("0" + game.roundCount); }
                    roundStart();
                }
            };
        game.flickerTimer = setInterval(light, 250);
    }
    //  每回合顺序亮灯
    function roundStart() {
        var orderCount = 0,
            round = function() {
                var index = game.order[orderCount],
                    audio = $audio[index];
                if (orderCount == game.roundCount) {
                    //  亮灯完毕,玩家可以开始操作
                    $audio.unbind();
                    clearInterval(game.roundTimer);
                    orderCount = 0;
                    $section.removeClass('unclickable').addClass("clickable");
                    return;
                }
                $colorBlock.eq(index).addClass('light');
                audio.play();
                audio.onended = function() {
                    $colorBlock.removeClass("light");
                    audio.onended = null;
                };
                orderCount++;
            };
        game.roundTimer = setInterval(round, 1500);
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
                game.strict = game.strict ? 0 : 1;
            }
            // 游戏开始/重置
            else if (tg.id == "start") {
                $colorBlock.removeClass("light");
                game.reset();
                $count.text("- -");
                flicker();
            }
        }
    });
    $section.mousedown(function(e) {
        var id = e.target.id;
        $(e.target).addClass('light');
        if (id == game.order[game.clickCount]) {
            //  玩家点击正确
            $audio[id].play();
            game.clickCount++;
            if (game.clickCount == game.roundCount) {
                //  玩家胜利
                if (game.roundCount == 20) {
                    alert("YOU WIN");
                    location.reload();
                }
                //  玩家点完一轮
                game.clickCount = 0;
                game.roundCount++;
                if (game.roundCount > 9) { $count.text(game.roundCount); } else { $count.text("0" + game.roundCount); }
                roundStart();
            }
        } else {
            //  玩家点击错误
            $count.text("! !");
            $audio[3].play(); //  可替换成警告音效
            game.clickCount = 0;
            if (game.strict) { game.roundCount = 1; }
            flicker();
        }
    }).mouseup(function(e) {
        $(e.target).removeClass('light');
        // 玩家点完一轮且松开鼠标，禁用点击
        if (!game.clickCount) { $section.addClass("unclickable"); }
    });
});
