$(function() {
    var config = {
        authDomain: "accelerator.wilddogio.com",
        syncURL: "https://accelerator.wilddogio.com"
    };
    wilddog.initializeApp(config);
    var ref = wilddog.sync().ref();
    var $send = $(".send"),
        $reset = $(".reset"),
        $pre_content = $(".pre_content");

    function topRandom() {
        return Math.random() * 360 - 15; 
    }

    function colorRandom() {
        return Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255);
    }

    function send(text) {
        var $text = $("<p class='text'>" + text + "</p>");
        var color = "rgb(" + colorRandom() + ")";
        var top = topRandom() + "px";
        var length = "-" + text.length * 12 + "px";
        $text.css({ "top": top, "color": color, "right": length }); 
        $(".content").append($text);
        $text.animate({
                right: "1800px"
            },
            10000,
            function() { $text.remove(); });
    }
    ref.child('message').on('child_added', function(arg) { 
        send(arg.val());
    });
    $send.click(function() {
        ref.child('message').push($pre_content.val());
        $pre_content.val("");
    });
    $reset.click(function() {
        $("p").remove();
        ref.remove();
    }); 
    $reset.click();
});
