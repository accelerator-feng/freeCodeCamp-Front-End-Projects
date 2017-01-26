$(function() {
    var users = ["ESL_SC2", "freecodecamp", "storbeck", "terakilobyte", "habathcx"],
        li = $("li"),
        all = $(".all"),
        img = $("img"),
        p = $("p"),
        a = $("a");

    function search(username, index) {
        $.getJSON("https://wind-bow.gomix.me/twitch-api/streams/" + username + "?callback=?", function(data) {
            var game = "",
                status = "";
            if (data.stream) {
                game = data.stream.game;
                status = "online";
                li.eq(index).addClass('onlineUser').find("a").css("color", "#5c5457");
            }
            $.getJSON("https://wind-bow.gomix.me/twitch-api/channels/" + username + "?callback=?", function(data) {
                console.log(data);
                var logoScr = data.logo || "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
                    displayNmae = data.display_name || username,
                    description = "offline";
                if (status) { description = ":" + data.status; }
                img.eq(index).attr('src', logoScr);
                a.eq(index).text(displayNmae).attr('href', data.url);
                p.eq(index).text(game + description);
                li.eq(index).slideDown(500);
            });

        });
    }
    users.forEach(search);
    $("header").click(function(e) {
        switch (e.target.className) {
            case "all":
                li.slideDown(500);
                console.log(123);
                break;
            case "online":
                li.show();
                all.css("width", "15");
                $("li:not(.onlineUser)").slideUp(500);
                break;
            case "offline":
                li.show();
                all.css("width", "15");
                $(".onlineUser").slideUp(500);
                break;
        }
    });
    all.mouseenter(function(event) {
        all.css("width", "70");
    }).mouseleave(function(event) {
        all.css("width", "15");
    });
});
