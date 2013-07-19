
$(document).ready(function () {  
  if ($('#social-share').offset() == null) return;
  var top = $('#social-share').offset().top - parseFloat($('#social-share').css('marginTop').replace(/auto/, 0));
  $(window).scroll(function (event) {
    var y = $(this).scrollTop();
    if (y >= top) {
      $('#social-share').addClass('fixed');
    } else {
      $('#social-share').removeClass('fixed');
    }
  });
});

var f_page = "attbusiness"; 
var t_page = "attbusiness"; 

function add_commas(number) {
	if (number.length > 3) {
		var mod = number.length % 3;
		var output = (mod > 0 ? (number.substring(0,mod)) : '');
		for (i=0 ; i < Math.floor(number.length / 3); i++) {
			if ((mod == 0) && (i == 0)) {
			output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
			} else {
			output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
			}
		}
		return (output);
	} else {
		return number;
	}
}

// when document is ready load the counts
$(document).ready(function(){
	// grab from facebook
//	$.getJSON('https://graph.facebook.com/'+f_page+'?callback=?', function(data) {
//		var fb_count = data['likes'].toString();
//		fb_count = add_commas(fb_count);
//		$('#fb_count').html(fb_count);
//	});

	// grab from twitter
	$.getJSON('http://api.twitter.com/1/users/show.json?screen_name='+t_page+'&callback=?', function(data) {
		twit_count = data['followers_count'].toString();
		twit_count = add_commas(twit_count);
		$('#twitter_count').html(twit_count);
	});

	// grab from youtube
	$.getJSON('http://gdata.youtube.com/feeds/api/users/ShareATT?alt=json&callback=?', function(data) {
       		you_count = data['entry']['yt$statistics']['subscriberCount'].toString();
        	you_count = add_commas(you_count);
        	$('#youtube_count').html(you_count);
	});

});

function youtubeFeedCallback( data ) {
	var yc = add_commas(data.entry[ "yt$statistics" ].viewCount);
	$('#yt_count').html(yc);
}

