$(document).ready(function () {
    //Execute when search button is clicked
    $("#SearchButtonIcon").click(function(){
        
        //Retrieve the link in search bar
        var amazonLink = $("#searchBar").val();
        //Trim and verify the link (make sure it is actual product)

        //Save the link in session storage so we can use it in next page
        // Save data to sessionStorage
        sessionStorage.setItem('amazonLink', amazonLink);

        // Get saved data from sessionStorage

        //Send user to next page --> product.html 
        $(location).attr('href', "product.html"); 


    });
});

    // When the searchbar search/submit button is pressed  
    // $("#submitBtn").click(function() { 
    //     //Retrieve the amazon link in the search bar                                                  
    //     var amazonLink = $("#searchBar").val();
    //     makeRequest(amazonLink);  
    // });