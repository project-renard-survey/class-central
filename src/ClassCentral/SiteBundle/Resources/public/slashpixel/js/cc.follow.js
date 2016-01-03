var CC = CC || {
        Class : {}
}

CC.Class['Follow'] = (function(){

    var utilities = CC.Class['Utilities'];

    function init() {
        $('.btn-follow-item').click(followClicked);
    }

    function followClicked(e) {
        e.preventDefault();
        var self = $(this);
        var item = $(this).data('item');
        var itemId = $(this).data('item-id');
        var itemName = $(this).data('item-name');
        var showItemName = $(this).data('show-item-name');

        $.ajax({
            url: "/ajax/isLoggedIn",
            cache: false,
            success: function( result ) {
                var loggedInResult = $.parseJSON(result);
                if( loggedInResult.loggedIn ){
                    ga('send','event','Follow',"Logged in", item);
                    // Follow the item
                    var followUrl = '/ajax/follow/' + item +'/' + itemId;

                    $.ajax({
                        url: followUrl,
                        cache:false,
                        success: function(r) {
                            var result = JSON.parse(r);
                            if(result['success']) {
                                // update the state to followed
                                var itemClass = '.btn-follow-item-' + item + '-' + itemId;
                                var btnText = "Following";
                                if(showItemName) {
                                    btnText = btnText + " <i>" + itemName + "</i>";
                                }
                                $(itemClass).addClass('active');
                                $(itemClass).find('.action-button__unit:eq(1)').html( btnText );

                                // Show a success notification
                                utilities.notify(
                                    "Following " + itemName,
                                    "You will receive regular course notifications and reminders about " + itemName,
                                    "success"
                                );

                            } else {
                                // Show a error notification
                                utilities.notify(
                                    "Following Failed" + itemName,
                                    "There was some error while following " + itemName + ". Please try again later.",
                                    "error"
                                );
                            }
                        }
                    });


                } else {

                    ga('send','event','Follow',"Logged Out", item);

                    // Save the follow info in session
                    $.ajax({
                        url: '/ajax/pre_follow/' + item +'/' + itemId,
                        cache: false,
                        success: function(r){
                            // do nothing
                        }
                    });

                    // Show signup modal
                    $('#signupModal-btn_follow').modal('show');
                }
            }
        });
    }

    /**
     * Shows a prompt asking the user if they want to be taken to the personalization
     * page
     * @param delay prompt delay in milliseconds
     */
    function showPersonalizationPrompt(delay) {

        var promptShownCookie = 'follow_personalized_page_prompt';
        if ( Cookies.get( promptShownCookie) === undefined ) {
            $.ajax({
                url: "/ajax/isLoggedIn",
                cache: true
            })
                .done(function(result){
                    var loggedInResult = $.parseJSON(result);
                    if( loggedInResult.loggedIn) {

                        // Show the signup form
                        setTimeout(function(){
                            swal({
                                title: "Meet Your Next Favourite Course",
                                text: "Get regular email updates of new and upcoming courses by following subjects, universities, and course providers.",
                                type: "info",
                                showCancelButton: true,
                                confirmButtonColor: "#043BFF",
                                confirmButtonText: "Start Personalizing Now",
                                closeOnConfirm: false
                            }, function () {
                                window.location.href = '/user/follows';
                            });
                        },delay);
                    }
                }
            );
            Cookies.set( promptShownCookie, 1, { expires :30} );
        }
    }

    return {
        init: init,
        showPersonalizationPrompt:showPersonalizationPrompt
    }
})();


CC.Class['Follow'].init();