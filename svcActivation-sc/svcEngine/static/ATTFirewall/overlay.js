
$(function() {
	$("a[rel]").overlay({
		// custom top position
		oneInstance: false,
		left : "center",
		top  : "center",
		//effect: 'apple',
		fixed : false,
		mask: {
			color: '#000000',	
			loadSpeed: 200,
			opacity: 0.85
		},
		closeOnClick: false,
		closeOnEsc:   true,
		// when overlay is opened, load our player
		onBeforeLoad : function() {
			var id = this.getTrigger().attr("id");
			document.getElementById(id).style.cssText += ";color: #81017E !important;";
			if ($.cookie('idCookie')) { $.cookie('idCookie', $.cookie('idCookie') + "," + id);
			} else { $.cookie('idCookie', id); }
			if (id == 'overlayload') {
				$('#iframeContainer').css('width','0px');
				$('#iframeContainer').css('left','0px');
				return;
			};
			$('#mediaContainer').css('width','600px');
			var wrap = this.getOverlay().find(".contentWrap");
			// load the page specified in the trigger
			var href = this.getTrigger().attr("href");

			// grab wrapper element inside content
			var fullURL = "/mediaplayer_overlay.jsp?file=" + href + "&overlay=true";
			wrap.load(fullURL);

			var IEBrowser = (navigator.appName == 'Microsoft Internet Explorer');
			var mediaTitle = this.getTrigger().attr("mediatitle");
			var maxLength = 65;
			var mediaTitleLen = mediaTitle.length;
			if (mediaTitleLen > maxLength) {
				var mediaTitle1 = mediaTitle.substring(0, maxLength + 1);
				var mediaTitleSpace = mediaTitle1.lastIndexOf(' ');
				mediaTitle = mediaTitle1.substring(0, mediaTitleSpace) + '<br>' + 
							 mediaTitle.substring(mediaTitleSpace + 1, mediaTitleSpace + maxLength + 1);
				if ((mediaTitleLen - mediaTitleSpace) > (maxLength + 1))	{ mediaTitle += '...'; }
				$('.overlayTitle').css('width', '500px');
				$('#mediaContainer').css('height','35px');
				if (IEBrowser) {
					$('#containerTitle').css('margin-bottom', '5px');
				} else {
					$('#containerTitle').css('margin-bottom', '18px');
				}
			} else if (IEBrowser) {
				$('#containerTitle').css('margin-bottom','0px');
			} 
			$('#containerTitle').empty();
			var titleHeading = "<div class='overlayTitle'><b>" + mediaTitle + "</b></div>" + 
								"<a href='javascript:void(0);' class='overlayClose' onClick=\"javascript:$('#" + id + "').overlay().close();\">" + 
								"<b>Close</b>&nbsp;&nbsp;<span class='overlayButton'><strong>X</strong></span></a>&nbsp;";
			$('#containerTitle').append(titleHeading);
			if (href.match('.mp3')) {
				$('#mediaContainer').css('margin-top','-25.5px');
			} else {
				$('#mediaContainer').css('margin-top','-193px');
			}

			var mediaId = this.getTrigger().attr("mediaid");
			var mediaTitle = this.getTrigger().attr("mediatitle");
			var pageid = this.getTrigger().attr("pageid");
			var showMedia = href.match('.mp3')?"showAudio":"showVideo";
			var overlayfid = document.getElementById('overlayfid');
			overlayfid.src = '/binary' + href + '/?overlay=true&mediaid=' + mediaId + '&mediatitle=' + escape(mediaTitle) + '&pageid=' + pageid + '&' + showMedia + '=true';
		},

		onLoad: function() {
			var id = this.getTrigger().attr("id");	
			if (id == 'overlayload') { 
				var overlayfid = document.getElementById('overlayfid');
				var overlaypath = overlayfid.contentWindow.document.location.pathname;
				var windowheight = document.documentElement.clientHeight;
				overlayfid.style.display = 'block';
				var overlayheight = overlayfid.contentWindow.document.getElementById('mainwindow').offsetHeight;
				overlayfid.style.height = overlayheight + "px";
				var actualheight = (windowheight - overlayheight)/2;
				if (actualheight < 0 ) actualheight = 0;
				document.getElementById('iframeContainer').style.left = (document.documentElement.clientWidth - overlayfid.width)/2 + "px";
				var csstopVar = actualheight + document.documentElement.scrollTop + document.body.scrollTop;
				document.getElementById('iframeContainer').style.cssText += ";top:" + csstopVar + "px;";
			}
		},				

		// when overlay is closed, unload our player
		onClose: function() {
			var id = this.getTrigger().attr("id");
			var overlayfid = document.getElementById('overlayfid');
			if (id == 'overlayload' && overlayfid != null) { 
				overlayfid.style.height = 0;
				$('#iframeContainer').css('width','600px');
				return; 
			} 
			if (id == 'videofile') {
				window.document.location.href = window.document.location.pathname;
				return;
			} 
			if (jwplayer('jwPlayer') != null) {
			    try {
				jwplayer('jwPlayer').remove();
			    } catch(err) {return;}
			}
			$('#containerTitle').empty();

			$('#containerTitle').css('margin-bottom', '4px');
			$('#mediaContent').empty();
			$('#mediaContainer').css('height','22px');
			if (id == 'mediafileoverlay') {
				var pageid = this.getTrigger().attr("pageid");
				var welcomePage = "/enterprise/profile/jointhank/page=overlay/";
				if (pageid != 'null') welcomePage += "?notyou=y";
				overlayfid.src = welcomePage;
				setTimeout("javascript:$('#overlayload').overlay().load();", 300);
				return;
			}
		}
	});
});


	function overlayWindow(varframe) {		
		$(document).ready(function(){
			var pathname = varframe.contentWindow.document.location.pathname;
			var overlayfid = document.getElementById('overlayfid');
			var href =  window.document.location.href;
			var page =  href.substring(href.indexOf('=')+1);
			var prefix = (page == "recommend_to_colleague/")?"/enterprise/":"/enterprise/profile/";
			var overlayIndex = href.indexOf("/overlay=");
			if (overlayIndex >= 0 && window.location.hash == "") {
					window.location.hash = '#load';
					varframe.contentWindow.document.location.replace(prefix + page + "page=overlay/");
			} else if ( pathname == "" || pathname == "/blank" || pathname == "blank") {
				if (window.location.hash == '#overlay') {
					var iframeurl = $.cookie('iframeurl');
					$.cookie('iframeurl', null);
					varframe.contentWindow.document.location.href = iframeurl;
				}
			} else {
				if (pathname == "/enterprise/exchange_home/" || pathname == "/wholesale/exchange_home/")	{
					overlayclose();
					window.document.location.href = varframe.contentWindow.document.location.href;
				} else if (pathname == "/redirect_ne.jsp" || pathname.indexOf("overlay=true") >= 0 || pathname.indexOf("/binary/") >= 0 ) {
				} else if ($('#overlayload').overlay().isOpened() || pathname == "/enterprise/profile/joincontent/page=overlay/" || pathname == "/enterprise/recommend_to_colleague/page=overlaythanks/" 
					|| pathname == "/enterprise/profile/reqaddlinfothank/page=overlay/" || pathname == "/enterprise/profile/updatethank/page=overlay/")	{
					overlayfid.style.height = overlayfid.contentWindow.document.getElementById('mainwindow').offsetHeight + "px";
				} else {
					overlayfid.style.display = 'none';
					$('#overlayload').overlay().load();
				}
			}
		});
	}

	function overlayclose() {
		$('#overlayload').overlay().close();
	}

	function overlayload(href, mediatitle, mediaid) {
		$("#videofile").attr('href', href);
		$("#videofile").attr('mediatitle', mediatitle);
		$("#videofile").attr('mediaid', mediaid);
		$('#mediaContainer').css('width','600px');
		$('#overlayload').overlay().close();
		setTimeout("javascript:$('#videofile').overlay().load();", 300);
	}

	function mediaload(href, mediatitle, mediaid, pageid) {
		$("#mediafileoverlay").attr('href', href);
		$("#mediafileoverlay").attr('mediatitle', mediatitle);
		$("#mediafileoverlay").attr('mediaid', mediaid);
		$("#mediafileoverlay").attr('pageid', pageid);
		$('#mediaContainer').css('width','600px');
		$('#overlayload').overlay().close();
		setTimeout("javascript:$('#mediafileoverlay').overlay().load();", 300);
	}

	function removespace() {
		if (window.document.location.pathname == "/manage.jsp") {
			$('#footerspace').remove();
		}
	}

	function overlayCookie(iframeurl) {
		window.location.hash = '#overlay';
		$.cookie('iframeurl', iframeurl);
	}
	function resetCookies() {
		window.location.hash = '#';
		$.cookie('iframeurl', null);
	}

	function redirectCookiedPage() {
		var pathname = window.document.location.pathname;
		var signinindex = pathname.indexOf('overlay=signin');
		if (signinindex < 0) {
			signinindex = pathname.indexOf('signin=y');
		}
		var redirectpath = pathname;
		if (signinindex >= 0 ) {
			redirectpath = pathname.substring(0, signinindex);
		}
		var joininitindex = pathname.indexOf('overlay=joininit');
		if (joininitindex >= 0 ) {
			redirectpath = pathname.substring(0, joininitindex );
		}	
		var recomtocolindex = pathname.indexOf('overlay=recommend_to_colleague');
		if(recomtocolindex >=0){
			redirectpath = pathname.substring(0, recomtocolindex);
		}	
		var updateindex = pathname.indexOf('overlay=update');
		if(updateindex >=0){
			redirectpath = pathname.substring(0, updateindex);
		}	
		window.document.location.href = redirectpath;
	}

	function flashTrack(eventValue) {
		var overlayfid = document.getElementById('overlayfid');
		overlayfid.contentWindow.flashTrack(eventValue);
	}
