$(document).ready(function () {
    $("#tabs").tabs();

    $(".rating span").on("click",(function(){
       $(this).parent().children("span").removeClass("on");
        $(this).addClass("on").prevAll("span").addClass("on");
        return false;
    });
});