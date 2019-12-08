//main / homepage js


$(document).ready(function () {
    //Execute when search button is clicked
    $("#SearchButtonIcon").click(function(){
        
        //Retrieve the link in search bar
        var amazonLink = $("#searchBar").val();

        //Trim input link
        var pos = amazonLink.indexOf("?");
        amazonLink = amazonLink.slice(0,pos);
        
        // *****TO DO*****
        //Verify that input link is actual Amazon product

        // Save url to sessionStorage so we can access it on next page
        sessionStorage.setItem('amazonLink', amazonLink);

        //Send user to next page --> product.html 
        $(location).attr('href', "product.html"); 
    });
});
