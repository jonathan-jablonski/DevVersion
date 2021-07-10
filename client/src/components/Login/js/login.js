(function ($) {
    'use strict';
	
	var parentDom = $('html, body');
	var pwdMask = $('.pwdMask > .form-control');
    var pwdToggler = $(".pwd-toggle");
    

    $('.lnk-toggler').on('click', function(e){
        e.preventDefault();
        var panel = $(this).data("panel");
        $('.authfy-panel.active').removeClass('active');
        $(panel).addClass("active");
    });

    // Password Mask Toggler
    
    $(pwdToggler).on("click", function(e) {
        e.preventDefault();
        $(this).toggleClass("fa-eye-slash fa-eye");
        if($(this).hasClass("fa-eye")) {
            $(pwdMask).attr("type", "text");
        }
        else {
            $(pwdMask).attr("type", "password");
        }
    });

    // Tab Activation Handler 
    
    $('#forget-lnk').on("click", function(){
        $('.authfy-login .nav-tabs').find("li").removeClass("active");
    });

	// Preloader 
	
	$(window).on('load', function () {
		$(".square-block").fadeOut();
		$('#preload-block').fadeOut('slow', function () {
			$(this).remove();
		});
	});
	
})(jQuery);