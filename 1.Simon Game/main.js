$(function() {
    var $switch = $('#switch'),
        $count = $('h2'),
        $section = $('section'),
        $colorBlock = $section.find('div'),
        $audio = $('audio'),
        game = {
            strict: 0, // 严格模式指示  
            roundTimer: null,
            flickerTimer: null,
            reset: function() {
                this.click = 0; // 点击次数
                this.count = 1; // COUNT计数
                this.order = getOrder(); // 亮灯顺序
                clearInterval(this.roundTimer);
                clearInterval(this.flickerTimer);
            }
        };
    $('.center').click(function(e) {
        var tg = e.target;
        // 游戏开关
        if (tg.id == 'switch') {
            $(tg).toggleClass('on');
            $count.toggleClass('light');
            if (!$switch.attr('class')) {
                location.reload();
            }
        }
        if ($switch.attr('class')) {
            // strict模式
            if (tg.id == 'strict') {
                $('.pilot-lamp').toggleClass('light');
                game.strict = game.strict ? 0 : 1;
            }
            // 游戏开始/重置
            else if (tg.id == 'start') {
                $colorBlock.removeClass('light');
                game.reset();
                refreshCount('- -');
            }
        }
    });
    $section.mousedown(function(e) {
        var tg = e.target;
        $(tg).addClass('light');
        if (tg.id == game.order[game.click]) {
            //  玩家点击正确
            $audio[tg.id].play();
            game.click++;
            if (game.click == game.count) {
                //  玩家胜利
                if (game.count == 20) {
                    alert('YOU WIN');
                    location.reload();
                }
                //  玩家点完一轮
                game.click = 0;
                game.count++;
                refreshCount();
                roundStart();
            }
        } else {
            //  玩家点击错误
            $audio[3].play(); //  可替换成警告音效
            game.click = 0;
            if (game.strict) { game.count = 1; }
            refreshCount('! !');
        }
    }).mouseup(function(e) {
        $(e.target).removeClass('light');
        // 玩家点完一轮且松开鼠标，禁用点击
        if (!game.click) { $section.addClass('unclickable'); }
    });
    //  生成亮灯顺序数组
    function getOrder() {
        var lightOrder = [],
            i = 0;
        for (; i < 20; i++) {
            var num = Math.round(Math.random() * 3);
            lightOrder.push(num);
        }
        return lightOrder;
    }
    // COUNT区闪烁
    function flicker() {
        var lightCount = 0;

        function light() {
            lightCount++;
            $count.toggleClass('light');
            if (lightCount == 4) {
                clearInterval(game.flickerTimer);
                refreshCount();
                roundStart();
            }
        }
        game.flickerTimer = setInterval(light, 250);
    }
    //  更新COUNT
    function refreshCount(content) {
        if (content) { $count.text(content); flicker(); } 
        else if (game.count > 9) { $count.text(game.count); } 
        else { $count.text('0' + game.count); }
    }
    //  每回合顺序亮灯
    function roundStart() {
        var orderCount = 0;

        function round() {
            var index = game.order[orderCount],
                audio = $audio[index];
            if (orderCount == game.count) {
                //  亮灯完毕,玩家可以开始操作
                clearInterval(game.roundTimer);
                orderCount = 0;
                $section.removeClass('unclickable').addClass('clickable');
                return;
            }
            $colorBlock.eq(index).addClass('light');
            audio.play();
            audio.onended = function() {
                $colorBlock.removeClass('light');
            };
            orderCount++;
        }
        game.roundTimer = setInterval(round, 1500);
    }
});
