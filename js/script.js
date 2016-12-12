'use strict';
svg4everybody();

var wow = new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    offset: 100, // default
    mobile: false, // default
    live: true // default
})
wow.init();

var person = $('.person__img');
person.addClass('wow zoomIn');

var menuLink = $('.menu__link');
menuLink.addClass('wow bounceIn');

var personName = $('.person__name');
var personProf = $('.person__prof');

personName.addClass('wow slideInUp');
personProf.addClass('wow slideInUp');

var content = $('.content__block');
content.addClass('wow slideInUp')

var contentInfo = $('.progects__info');
contentInfo.addClass('wow slideInUp')

var icon = $('.content__icon');
icon.css({'animation-delay': '1s', 'animatio-duration': '1s'})
icon.addClass('wow zoomIn');

var contactsIcon = $('.contacts__item');
contactsIcon.css({'animation-delay': '1s', 'animatio-duration': '1s'})
contactsIcon.addClass('wow zoomIn');


var acc = document.getElementsByClassName("progects__title");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}


$(document).ready(function(){
     $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('.lift-up').fadeIn();
            } else {
                $('.lift-up').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('.lift-up').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
 

});


// Preloader
$(window).on('load',function() {
	$("#loading-center").on('click', function() {
	$("#loading").fadeOut(500);
	})		
});

$(window).on('load', function() {
   $("#loading").fadeOut(500);
})


$(window).on('load',function() {
	$("#loading").delay(2000).fadeOut(500);
	$("#loading-center").on('click',function() {
	$("#loading").fadeOut(500);
	})
})