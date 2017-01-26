$(function() {
    var btn = $("button"),
        PLAYER = "",
        AI = "",
        arr = [
            [0, 1, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        Xcase = "",
        aiSteps = 0;

    function box(index) {
        return btn.eq(index).val();
    }

    function result(msg) {
        btn.attr('disabled', 'disabled');
        setTimeout(function() {
            alert(msg);
            location.reload();
        }, 600);
    }

    function checkSituation() {
        if (arr.some(function(item) {
                return concatBox(item) == "111";
            })) {
            result("你输了 :-(");
        } else if ($("button[disabled]").length === 9) {
            result("平局");
        }
    }

    function randomStep() {
        var voidId = $("button[value='0']").eq(0).data("index");
        aiClick(voidId);
    }

    function aiClick(index) {
        btn.eq(index).text(AI).prop({ "disabled": "disabled", "value": "1", }).css("color", "#000");
        checkSituation();
    }

    function aiRound() {
        if (arr.some(function(item) {
                return attack(item);
            })) {
            return;
        }
        if (arr.some(function(item) {
                return defense(item);
            })) {
            return;
        }
        if (AI === "X") {
            if (aiSteps === 1) {
                switch (true) {
                    case box(1) == -1 || box(3) == -1:
                        Xcase = "1";
                        aiClick(4);
                        break;
                    case box(2) == -1 || box(6) == -1:
                        Xcase = "2";
                        aiClick(8);
                        break;
                    case box(5) == -1 || box(7) == -1:
                        Xcase = "3";
                        aiClick(4);
                        break;
                    case box(8) == -1:
                        Xcase = "4";
                        aiClick(2);
                        break;
                    default:
                        aiClick(8);
                        break;
                }
            }
            if (aiSteps === 2) {
                switch (Xcase) {
                    case "1":
                        if (box(3) == -1) { aiClick(2); } else { aiClick(6); }
                        break;
                    case "2":
                        if (box(2) == -1) { aiClick(6); } else { aiClick(2); }
                        break;
                    case "3":
                        if (box(5) == -1) { aiClick(2); } else { aiClick(6); }
                        break;
                    case "4":
                        aiClick(6);
                        break;
                }
            }
        }
        if (AI === "O") {
            if (aiSteps === 0) {
                if (box(4) == -1) {
                    aiClick(0);
                } else {
                    aiClick(4);
                }
            } else if (aiSteps === 1) {
                if (parseInt(box(0)) + parseInt(box(2)) + parseInt(box(6)) + parseInt(box(8)) == 2) { aiClick(1); } 
                else if (box(2) + box(3) == "-1-1" || box(1) + box(6) == "-1-1" || box(1) + box(3) == "-1-1") { aiClick(0); } 
                else if (box(0) + box(5) == "-1-1" || box(1) + box(8) == "-1-1" || box(1) + box(5) == "-1-1") { aiClick(2); } 
                else if (box(0) + box(7) == "-1-1" || box(3) + box(8) == "-1-1" || box(3) + box(7) == "-1-1") { aiClick(6); } 
                else if (box(5) + box(7) == "-1-1" || box(5) + box(6) == "-1-1" || box(2) + box(7) == "-1-1") { aiClick(8); } 
                else if (box(0) + box(8) == "-1-1" || box(2) + box(6) == "-1-1") { aiClick(1); } 
                else { aiClick(2); }
            } else if (aiSteps === 2 || aiSteps === 3) { randomStep(); }
        }
    }

    function concatBox(arr) {
        return box(arr[0]) + box(arr[1]) + box(arr[2]);
    }

    function attack(arr) {
        switch (concatBox(arr)) {
            case "011":
                aiClick(arr[0]);
                return true;
            case "101":
                aiClick(arr[1]);
                return true;
            case "110":
                aiClick(arr[2]);
                return true;
        }
    }

    function defense(arr) {
        switch (concatBox(arr)) {
            case "0-1-1":
                aiClick(arr[0]);
                return true;
            case "-10-1":
                aiClick(arr[1]);
                return true;
            case "-1-10":
                aiClick(arr[2]);
                return true;
        }
    }
    btn.removeAttr("disabled");
    $("div input").click(function() {
        PLAYER = $(this).attr("value");
        AI = PLAYER === "X" ? "O" : "X";
        $(".mask").hide();
        if (AI === "X") {
            aiClick(0);
            aiSteps++;
        }
    });

    $("main button").click(function() {
        $(this).text(PLAYER).prop({ "disabled": "disabled", "value": "-1", }).css("color", "#000");
        checkSituation();
        aiRound();
        aiSteps++;
    });
});
