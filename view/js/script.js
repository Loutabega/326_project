$(document).ready(function () {

    $("#tabs").tabs();

    $("#rating span").click(function(){
        $(this).parent().children("span").removeClass("on");
        $(this).addClass("on").prevAll("span").addClass("on");
        return false;
    });

    $("#createReviewBtn").click(function(){
        $("#review_form").toggle();
        $(this).hide();
    });

    $("#addArticleBtn").click(function(){
        $("#article_form").toggle();
        $(this).hide();
    });    

});


 