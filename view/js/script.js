$(document).ready(function () {
    $("#tabs").tabs();

    $("#rating span").click(function(){

        $(this).parent().children("span").removeClass("on");
        $(this).addClass("on").prevAll("span").addClass("on");
        return false;
    });

    $("#createReviewBtn").click(function(){
        $("#review_form").show();
    });

    $("#cancel").click(function(){
        $("#rating span").parent().children("span").removeClass("on");
        $("#review_form").hide();
    })
    $("#review_form").submit(function(){
        var stars = $("#rating span").parent().find(".star.on").length;
        var errorCount =0;
        var data = $("#rating_form").serializeObject();
        alert(data);
     });
});


 
