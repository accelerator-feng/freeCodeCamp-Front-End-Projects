$(function() {
    var $switch = $('#switch'),
        $count = $('h2'),
        $section = $('section'),
        $colorBlock = $section.find('div'),
        $audio = $('audio'),
        roundTimer = null, // 间歇调用ID
        flickerTimer = null,
        game = function() {
            var status = {
                strict: 0, // strict模式指示 
                reset: {
                    click: function() { status.click = 0; },
                    count: function() { status.count = 1; },
                    all: function() {
                        status.click = 0; // 玩家已点击次数
                        status.count = 1; // COUNT计数
                        status.order = getOrder(); // 亮灯顺序
                        clearInterval(roundTimer);
                        clearInterval(flickerTimer);
                    }
                }
            };
            return {
                get: function(pro) { pro = pro || 'count'; return status[pro]; },
                reset: function(pro) { pro = pro || 'all'; status.reset[pro](); },
                increase: function(pro) { pro = pro || 'count'; status[pro]++; },
                changeMode: function() { status.strict = status.strict ? 0 : 1; }
            };
        }();
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
                game.changeMode();
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
        var tg = e.target,
            length = game.get(),
            index = game.get('click');
        $(tg).addClass('light');
        if (tg.id == game.get('order')[index]) {
            //  玩家点击正确
            $audio[tg.id].play();
            game.increase('click');
            if (index == length - 1) {
                //  玩家胜利
                if (length == 20) {
                    alert('YOU WIN');
                    location.reload();
                }
                //  玩家点完一轮
                game.reset('click');
                game.increase();
                refreshCount();
            }
        } else {
            //  玩家点击错误
            $audio[3].play(); //  可替换成警告音效
            game.reset('click');
            if (game.get('strict')) { game.reset('count'); }
            refreshCount('! !');
        }
    }).mouseup(function(e) {
        $(e.target).removeClass('light');
        // 玩家点完一轮且松开鼠标，禁用点击
        if (!game.get('click')) { $section.addClass('unclickable'); }
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
                clearInterval(flickerTimer);
                refreshCount();
            }
        }
        flickerTimer = setInterval(light, 250);
    }
    //  更新COUNT
    function refreshCount(content) {
        var count = game.get();
        if (content) { $count.text(content); flicker(); } 
        else { if (count > 9) $count.text(count); else $count.text('0' + count); roundStart(); }
    }
    //  每回合顺序亮灯
    function roundStart() {
        var lightCount = 0;

        function round() {
            var index = game.get('order')[lightCount],
                audio = $audio[index];
            if (lightCount == game.get()) {
                //  亮灯完毕,玩家可以开始操作
                clearInterval(roundTimer);
                lightCount = 0;
                $section.removeClass('unclickable').addClass('clickable');
                return;
            }
            $colorBlock.eq(index).addClass('light');
            audio.play();
            audio.onended = function() {
                $colorBlock.removeClass('light');
            };
            lightCount++;
        }
        roundTimer = setInterval(round, 1500);
    }
});
