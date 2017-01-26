$(function() {
    $("form").submit(function(e) { 
        e.preventDefault();
        var text = $("input").val();
        $("span").remove();
        $("ul").slideUp(500);
        text && search(text);
    });

    function search(text) {
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&origin=*&gsrsearch=' + text, 
            success: function(response) {
                $("li").remove();
                try {
                    var result = "";
                    for (var index in response.query.pages) {
                        var r = response.query.pages[index];
                        if (r.thumbnail) {
                            var imgSrc = r.thumbnail.source;
                            result += "<li><h3><a href=" + "https://en.wikipedia.org/wiki/" + encodeURIComponent(r.title) + ">" + r.title + "</a></h3>" + "<img src=" + imgSrc + "><p>" + r.extract + "</p></li>";
                        } else { result += "<li><h3><a href=" + "https://en.wikipedia.org/wiki/" + encodeURIComponent(r.title) + " target='_blank'>" + r.title + "</a></h3><p>" + r.extract + "</p></li>"; }
                    }
                    $("ul").append($(result)).slideDown(500);
                } catch (err) { $("main").append($("<span>没有找到相关内容:-(</span>")); }
            }
        });
    }
});
