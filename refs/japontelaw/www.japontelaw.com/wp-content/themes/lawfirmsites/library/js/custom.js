jQuery(document).ready(function($){

    $('#header .mean-menu-nav').meanmenu();

    $('.gfield input, .gfield textarea').on('click',function(){
        $(this).parent().parent().addClass('labelout');
    });

    $('.vid-btn').on('click', function(){

        // console.log('nanana');

        var yt_id = $(this).attr('data-video');
        var pl_id = $(this).attr('data-player');

        PlayThisVideo(yt_id , pl_id );

        $(this).fadeOut('slow');

        $(this).next().fadeOut('slow');

         
    });

    $('.control-slick span').on('click',function(){

        if( $(this).hasClass('left') ){
            $(this).parent().prev().slick('slickPrev');
        }else{
            $(this).parent().prev().slick('slickNext');
        }

    });

    $(window).scroll(function() {
       scroll_magic();
    });
    scroll_magic();

    function scroll_magic(){
        var wH = $(window).height() * .66,
            wS = $(this).scrollTop();
       // $('.scroll-digit').html(wH);
       $('.scroll-effect').each(function(){
            var divTop = $(this).offset().top;
            if( wS > divTop - wH ){
                $(this).addClass('effect-on');
            }
       });

       if( wS > 150 ){
            $('body').addClass('colored-menu');
       }else{
            $('body').removeClass('colored-menu');
       }

    }


    $('.featured-block').slick({
        dots: false,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive:[
             {
              breakpoint: 991,
              settings: {
                slidesToShow: 1,
                dots: true
              }
            }
        ]
    });
    $('.atty-slide').slick({
        dots: false,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive:[
             {
              breakpoint: 991,
              settings: {
                slidesToShow: 1,
                dots: true
              }
            }
        ]
    });
    $('.testi-slide').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-left slickbtn"><svg width="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.4308 11.6071L25 11.6071L25 13.3929L3.4308 13.3929L13.7741 23.7362L12.5 25L8.14564e-07 12.5L12.5 -8.14564e-07L13.7741 1.26384L3.4308 11.6071Z" /></svg><span class="hide-text">Prev</span></button>',
        nextArrow: '<button type="button" class="slick-right slickbtn"><svg width="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5692 13.3929H0V11.6071H21.5692L11.2259 1.26384L12.5 0L25 12.5L12.5 25L11.2259 23.7362L21.5692 13.3929Z" /></svg><span class="hide-text">Next</span></button>',
    });

    // alert();
});


// Youtube This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function PlayThisVideo(vidid, playerid){
player = new YT.Player( playerid , {
  width: '100%',
  // videoId: vidid + '?rel=0' ,
  videoId: vidid,
  playerVars: { 'autoplay': 1, 'playsinline': 1 , 'rel': 0 },
  events: {
    'onReady': onPlayerReady
  }
});
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
 // event.target.mute();
    event.target.playVideo();
}