$(function() {
    var $input = $("input");
    $("main").mousedown(function(event) {
        var btn = $(event.target),
            value = btn.data("value"),    // 按键值
            result = $input.val(),    // 屏幕显示
            len = result.length;
        btn.css("background", "#2c9e95");
        // +-*/.后面不能接+-*/
        if (/[\+-\/\.\*]$/.test(result) && /[\+\/\*-]/.test(value)) {
            return false;
        }
        // 不能出现连续小数点或一个数里多个小数点的情况 
        if (/\.\d*$/.test(result) && value === ".") {
            return false;
        }
        // *和/不能出现在开头
        if (result === "" && /[\*\/]/.test(value)) {
            return false;
        }
        // 0不能作为整数部分的开头
        if (/\D0$/.test(result) && /\d/.test(value)) {
            return false;
        }
        if (result === "0" && /\d/.test(value)) {
            $input.val(value);
            return true;
        }
        // 清除溢出
        if (result === "error") { $input.val(""); }
        switch (value) {
            // 清空
            case "clear":
                $input.val("");
                break;
                // 退格
            case "backspace":
                var arr = result.split("");
                $input.val(arr.slice(0, arr.length - 1).join(""));
                break;
                // 求值
            case "equal":
                if (result === "") {
                    return false;
                }
                $input.val(eval(result));
                break;
                // 输入
            default:
                $input.val(result + value);
                break;
        }
        // 溢出
        if ($input.val() === "Infinity") { $input.val("error"); }
        // 缩放显示
        if (len > 9) { $input.css("fontSize", "75px"); } else { $input.css("fontSize", "100px"); }
    });
    $("html").mouseup(function() {
            $("div").css("background", "#02323e");
        });
});
