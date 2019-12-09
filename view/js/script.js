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

    $("#check_review").change(function(){
        if($(this).is(":checked")){

        };
        $("#review_form").show();

    });

    $("#review_form").submit(function(){
        var stars = $("#rating span").parent().find(".star.on").length;
        var errorCount =0;
        var data = $("#rating_form").serializeObject();
        alert(data);
     });

    $("#check_article").change(function(){
        $("#article_form").toggle();
    });    

    $("#article_form").submit(function(){
        var values =  $(this).serialize();
         alert(values);
     });

});


 
