$(document).ready(function () {

    $("#tabs").tabs();

    console.log("hello");

    $(".rating span").click(function(){
       $(this).parent().children("span").removeClass("on");
        $(this).addClass("on").prevAll("span").addClass("on");
        return false;
    });
});


