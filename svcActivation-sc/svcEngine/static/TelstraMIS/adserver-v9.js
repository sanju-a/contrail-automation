/* Code customized by Datalicious, insights@datalicious.com, http://www.datalicious.com */
/* Telstra Ad Server Tags - This file is called by datalicious.js */

// Write a container for adserver requests
document.write('<div style="display:none;" id="adserver_iframe"></div>');
document.write('<div style="display:none;" id="adserver_iframe2"></div>');
document.write('<div style="display:none;" id="adserver_iframe3"></div>');

adserver = {
	'datRand' : ((Math.random())*100000000),
	'datFirstVisit' : false,
	'checkEvent' : function() {
		var events_array = s.events.split(',');
		var event = '';
		for(var i = 0; i < events_array.length; i++) {
			if(events_array[i] === "event5") return "purchase";
		}
		for(var i = 0; i < events_array.length; i++) {
			if(events_array[i] === "event23") return "funnelstart";
		}
		for(var i = 0; i < events_array.length; i++) {
			if(events_array[i] === "event6") return "lead";
		}
		for(var i = 0; i < events_array.length; i++) {
			if(events_array[i] === "prodView" || events_array[i] === "event15") return "productview";
		}
		return '';
	},
	'unitag' : function() {
		var googleTagBase = '<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/';
			document.getElementById('adserver_iframe3').innerHTML = googleTagBase + '961682341/?value=0&amp;label=dsGOCOuwwQQQpbfIygM&amp;guid=ON&amp;script=0"/>';
	},
	'xDeviceTagging' : function() {
		if(debug)console.log('adserver.xDeviceTagging()');
		var googleTagBase = '<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/';
			document.getElementById('adserver_iframe2').innerHTML = googleTagBase + '1014419718/?value=0&amp;label=JnjfCNrXpwUQhqLb4wM&amp;guid=ON&amp;script=0"/>';
	},
	'getSegment' : function() {
		if(typeof s.events != 'undefined') {
			var eventsArray = s.events.split(',');
			for(var i = 0; i < eventsArray.length; i++) {
				if(eventsArray[i] == 'event5' || eventsArray[i] == 'event8')
				return "c"; // Visitor made a purchase or just logged in.
			}
			for(var i = 0; i < eventsArray.length; i++) {
				if(eventsArray[i] == 'event23' || eventsArray[i] == 'event14' || eventsArray[i] == 'event16')
				return "p"; // Visitor started a funnel, used shop locator, or livechat
			}
		}
		return "s";
	},
	matches_page: (function() {
		// In order for the matching logic to be semantic, we wrap the matchLocation helper function in a closure
		// The function that actually gets called from other code is the function we return from here

		var matchLocation = function (part, pageObj) {
			// Tries to match the specified 'part' of window.location against the corresponding attribute of pageObj
			// Returns true if pageObj does not have this part as it means we are not concerned about it
			if (debug) console.log('Testing ' + window.location[part] + ' against ' + JSON.stringify(pageObj[part]));
			if (typeof pageObj[part] !== 'undefined') {
				// Are we matching against a string or a regexp?
				if (typeof pageObj[part] === 'string') {
					if (typeof pageObj.match !== 'undefined' && pageObj.match == 'exact') {
						if (window.location[part] === pageObj[part]) {
							return true;
						} else {
							return false;
						}
					}
					if (window.location[part].indexOf(pageObj[part]) > -1) {
						return true;
					} else {
						return false;
					}
				} else if (typeof pageObj[part] === 'object' && typeof pageObj[part].test === 'function') {
					// TODO - it's a regexp - match against it
					return pageObj[part].test(window.location[part]);
				}
			} else {
				return true;
			}
		};

		var satisfies_custom_rules = function(pageObj) {
			if (typeof pageObj.custom_rule === 'function') {
				return pageObj.custom_rule();
			} else {
				return true;
			}
		};

		return function matches_page (pageObj) {
			// Check against both the pathname and the query string
			if(matchLocation('search', pageObj) && matchLocation('pathname', pageObj) && satisfies_custom_rules(pageObj)) {
				// Also check any custom rules that exist
				return true;
			}
			return false;
		};
	}()),
	orderTagging: {
	/*
		This has a number of responsibilities.
		At the start of the funnel, we need to fire some pixels based on the product.
		We need to fire some pixels at the end of the funnel based on the product.
		Product is not always available at the end of the funnel - we cannot use product SKU.
		So instead we use a session cookie to store the product name from the start of the funnel
		And if a user drops off a funnel and is seen anywhere else, we make sure this cookie is removed
		If there's no product available at funnel end, we fire a generic tag
	*/
		track: (function () {
			"use strict";
			var productCookieName = 'or_fun_prod';
			var funnelStageCookieName = 'or_fun_stage';
			var productCookieValue = getDatCookie(productCookieName);
			var funnelStageCookieValue = getDatCookie(funnelStageCookieName);
			var container;
			var adserver_iframe = (function () {
				/* Build the iframe for holding the tags */
				var iframe = document.createElement('div');
				container = document.getElementById('adserver_iframe');
				iframe.width = 1;
				iframe.height = 1;
				iframe.frameborder = 0;
				iframe.style.display = 'none';
				container.appendChild(iframe);
				return iframe;
			}());

			var tagMapping = (function () {
				var rand = Math.random() * 10000000000000000;

				var buildOpts = function(opts) {
                    if (!opts) opts = {};
                    if (!opts.postcode && /^\?map/i.test(window.location.search)) {
                        var match = /\+(\d{4}),/i.exec(window.location.search);
                        opts.postcode = (match && match[1]) || '';
                    } else {
						opts.postcode = '';
					}
                    opts.cost = opts.cost || '0';
                    opts.product = opts.product || '';

                    return opts;
                };

				var buildConversionTagURL = function (type, cat, opts) {
					opts = buildOpts(opts);
					var orderID;
					if (typeof s.purchaseID !== 'undefined' && s.purchaseID.length > 0) {
						orderID = s.purchaseID;
					} else {
	  					orderID = rand;
					}
					return ("//fls.doubleclick.net/activityi;src=3603226;type=" + type
						+ ";cat=" + cat
						+ ";qty=1;cost=" + opts.cost
						+ ";u1=;u5=" + s.prop45
						+ ";u4=;u3=;u2=datalicious;ord=" + orderID
						+ "?");
				};

				var buildTargetingTagURL = function (type, cat, opts) {
					var opts = buildOpts(opts);
					var url = "//fls.doubleclick.net/activityi;src=3603226;type=" + type
					+ ";cat=" + cat + ";u1=";
					if (type === "defaul_c" && cat === "defaul_d"){
						try{
							url += adserver.mediaChannel.trafficSource;
							url += ";u3=" + adserver.mediaChannel.searchKeyword;
						}catch(e){}
					}else{
						url += ";u3=";
					}
					url += ";u5=" + s.prop45;
					url += ";u4=" + opts.postcode;
					url += ";u2=datalicious;ord=1;num=" + rand + "?";
					return (url);
				};

				return {
					landing_page: function () {
							return buildTargetingTagURL('defaul_c', 'defaul_d');
					},
					test: {
						start: function () {
							return buildTargetingTagURL('test', 'test');
						}
					},
					prepaid_mobile: {
						consideration: function () {
							return buildTargetingTagURL('premob_c', 'premob_c');
						},
						start: function () {
							return buildTargetingTagURL('premob_c', 'premob_i');
						},
						finish: function () {
							return buildConversionTagURL('premob_s', 'premob_p');
						}
					},
					galaxy_s4: {
						consideration: function () {
							return buildTargetingTagURL('samsu222', 'samsu599');
						},
						start: function () {
							return buildTargetingTagURL('samsu222', 'samsu572');
						},
						finish: function () {
							return buildConversionTagURL('samsu357', 'samsu690');
						}
					},
					postpaid_mobile: {
						consideration: function () {
							return buildTargetingTagURL('posmob_c', 'posmob_c');
						},
						start: function () {
							return buildTargetingTagURL('posmob_c', 'posmob_i');
						},
						finish: function () {
							return buildConversionTagURL('posmob_s', 'posmob_p');
						}
					},
					postpaid_mobile_byo: {
						consideration: function () {
							return buildTargetingTagURL('byoco066', 'byo-c564');
						},
						start: function () {
							return buildTargetingTagURL('byoco066', 'byo-p707');
						},
						finish: function () {
							return buildConversionTagURL('byosa287', 'byo-p755');
						}
					},
					no_lock_in: {
						consideration: function () {
							return buildTargetingTagURL('noloc734', 'nlipc332');
						},
						start: function () {
							return buildTargetingTagURL('noloc734', 'nlipp456');
						},
						finish: function () {
							return buildConversionTagURL('noloc455', 'nlipp423');
						}
					},
					fixed_broadband: {
						consideration: function () {
							return buildTargetingTagURL('fixbro_c', 'fixbro_c');
						},
						start: function () {
							return buildTargetingTagURL('fixbro_c', 'fixbro_i');
						}
					},
					postpaid_tablet: {
						consideration: function () {
							return buildTargetingTagURL('pretab_c', 'postab_c');
						},
						start: function () {
							return buildTargetingTagURL('pretab_c', 'postab_i');
						},
						finish: function () {
							return buildConversionTagURL('pretab_s', 'postab_p');
						}
					},
					prepaid_tablet: {
						consideration: function () {
							return buildTargetingTagURL('postab_c', 'pretab_c');
						}
					},
					prepaid_wireless_broadband: {
						consideration: function () {
							return buildTargetingTagURL('prepa669', 'prepa734');
						},
						start: function () {
							return buildTargetingTagURL('prepa669', 'prepa560');
						},
						finish: function () {
							return buildConversionTagURL('prepa760', 'prepa793');
						}
					},
					postpaid_wireless_broadband: {
						consideration: function () {
							return buildTargetingTagURL('postp450', 'postp629');
						},
						start: function () {
							return buildTargetingTagURL('postp450', 'postp148');
						},
						finish: function () {
							return buildConversionTagURL('postp847', 'postp404');
						}
					},
					bundles: {
						consideration: function () {
							return buildTargetingTagURL('bundle_c', 'bundle_c');
						},
						start: function () {
							return buildTargetingTagURL('bundle_c', 'bundle_i');
						},
						finish: function () {
							return buildConversionTagURL('bundle_s', 'bundle_p');
						}
					},
					foxtel: {
						consideration: function () {
							return buildTargetingTagURL('foxtel_c', 'foxtel_c');
						},
						start: function () {
							return buildTargetingTagURL('foxtel_c', 'foxtel_i');
						},
						finish: function () {
							return buildConversionTagURL('foxtel_s', 'foxtel_p');
						}
					},
					online_billing: {
						consideration: function () {
							return buildTargetingTagURL('onbill_c', 'onlin635');
						},
						start: function () {
							return buildTargetingTagURL('onbill_c', 'onlin507');
						},
						finish: function () {
							return buildConversionTagURL('onbill_s', 'onlin922');
						}
					},
					international_roaming: {
						consideration: function () {
							return buildTargetingTagURL('globa254', 'globa662');
						},
						start: function () {
							return buildTargetingTagURL('globa254', 'globa332');
						},
						finish: function () {
							return buildConversionTagURL('globa700', 'globa369');
						}
					},
					moving_home: {
						consideration: function () {
							return buildTargetingTagURL('mover750', 'mover975');
						},
						start: function () {
							return buildTargetingTagURL('mover750', 'mover212');
						},
						finish: function () {
							return buildConversionTagURL('mover883', 'mover375');
						}
					},
					personal_shopping: {
						start: function () {
							return buildTargetingTagURL('perso855', 'perso932');
						},
						finish: function () {
							return buildConversionTagURL('perso855', 'perso848');
						}
					},
					store_finder: {
						start: function () {
							return buildTargetingTagURL('store021', 'store045');
						},
						finish: function () {
							return buildTargetingTagURL('store021', 'store147');
						}
					},
					customer_service: {
						consideration: function () {
							return buildTargetingTagURL('cusser_c', 'cusser_c');
						},
						start: function () {
							return buildTargetingTagURL('cusser_c', 'cusser_i');
						},
						finish: function () {
							return buildConversionTagURL('cusser_s', 'cusser_p');
						}
					},
					t_box: {
						consideration: function () {
							return buildTargetingTagURL('devtbo_c', 'devtbo_c');
						},
						start: function () {
							return buildTargetingTagURL('devtbo_c', 'devtbo_i');
						},
						finish: function () {
							return buildConversionTagURL('devtbo_s', 'devtbo_p');
						}
					},
					t_hub: {
						consideration: function () {
							return buildTargetingTagURL('devthu_c', 'devthu_c');
						},
						start: function () {
							return buildTargetingTagURL('devthu_c', 'devthu_i');
						},
						finish: function () {
							return buildConversionTagURL('devthu_s', 'devthu_p');
						}
					},
					pstn: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'pstnb235');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'pstnb175');
						},
						finish: function () {
							return buildConversionTagURL('bus_s', 'pstnb474');
						}
					},
					business_postpaid_mobile: {
						consideration: function () {
							return buildTargetingTagURL('busin571','postp332');
						},
						start: function () {
							return buildTargetingTagURL('busin571','postp141');
						},
						finish: function () {
							return buildConversionTagURL('bus_s','postp819');
						}
					},
					business_fixed_broadband: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'fixed386');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'fixed180');
						}
					},
					business_postpaid_tablet: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'postp321');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'postp693');
						},
						finish: function () {
							return buildConversionTagURL('bus_s','postp697');
						}
					},
					business_wireless_broadband: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'wirel763');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'wirel049');
						},
						finish: function () {
							return buildConversionTagURL('bus_s','wirel640');
						}
					},
					business_bundles: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'bundl051');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'bundl508');
						}
					},
					business_landlines: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'landl966');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'landl317');
						}
					},
					business_cloud_service: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'cloud669');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'cloud803');
						}
					},
					business_managed_service: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 'manag611');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'manag258');
						}
					},
					business_tsuite_software: {
						consideration: function () {
							return buildTargetingTagURL('busin571', 't-sui779');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 't-sui261');
						}
					},
					business_customer_service:{
						consideration: function () {
							return buildTargetingTagURL('busin571', 'custo322');
						},
						start: function () {
							return buildTargetingTagURL('busin571', 'custo178');
						},
						finish: function () {
							return buildConversionTagURL('bus_s','custo349');
						}
					},
					teg_clever_aust:{
						consideration: function() {return buildTargetingTagURL('busin081','busin466');},
						start: function() {return buildTargetingTagURL('busin081','busin609');},
						finish: function() {return buildConversionTagURL('busin134','busin373');}
					},
					generic: {
						consideration: function () {
							return buildTargetingTagURL('defaul_c', 'defaul_c');
						},
						start: function () {
							return buildTargetingTagURL('defaul_c', 'defaul_i');
						},
						finish: function () {
							return buildConversionTagURL('defaul_s', 'defaul_p');
						}
					}
				};
			}());

			var fireTagContainer = function (tagName, variant) {
				/* Grab this container and create an element for each tag in it */
				var i, url;
				if (tagMapping.hasOwnProperty(tagName)) {
					if (typeof variant !== 'undefined') {
						if (tagMapping[tagName].hasOwnProperty(variant)) {
							url = tagMapping[tagName][variant]();
						} else {
							return;
						}
					} else {
						url = tagMapping[tagName]();
					}
					var iframe = document.createElement('iframe');
					iframe.width = 1;
					iframe.height = 1;
					iframe.frameborder = 0;
					iframe.style.display = 'none';
					iframe.src = url;
					adserver_iframe.appendChild(iframe);
				}
			};

			var bindClickHandler = function (element, handler) {
				if (element.addEventListener) {
					element.addEventListener('click', function () {
						handler();
					});
				} else if (element.attachEvent) {
					element.attachEvent('onclick', function () {
						handler();
					});
				}
			};

			var bindToLinkWithText = function (regexp, event, cB) {
				var i, links = document.getElementsByTagName('a');
				if (event === 'click') { /* At the moment this only supports click events. */
					for (i = 0; i < links.length; i += 1) { /* Iterate over every link on the page */
						if (regexp.test(links[i].innerHTML)) { /* Does this link's innerHTML match the regexp? */
							bindClickHandler(links[i], cB);
						}
					}
				}
			};


			var bindToClass = function (className, eventName, cB) {
				var i, elements = getElementsUsingClassName(className);
				for (i = 0; i < elements.length; i += 1) {
					if (eventName === 'click') {
						bindClickHandler(elements[i], cB);
					}
				}
			};

			var trackOldShop = (function () {
				var onOldShop = (function () {
					return (/online-shop/i.test(window.location.pathname));
				}());

				/* Clear the product cookie if we are not on the old shop anymore */
				if (!onOldShop) {
					setDatCookie(productCookieName, '', 0, '.telstra.com.au');
				}

				return function trackOldShop(product_category) {
					/* Record the product category in a cookie so that it is available later in the funnel */
					if (productCookieValue.length === 0) {
						setDatCookie(productCookieName, product_category, null, '.telstra.com.au');
					}
				};
			}());

			var funnelRules = {
				/* Includes the product consideration, purchase intent and conversion points for all product categories */
				test: {
					consideration: [
						{
							pathname: [/\.*/],
							search: [/datalicious=test_mediamind_consideration/]
						}
					],
					start: [
						{
							pathname: [/\.*/],
							search: [/datalicious=test_mediamind_start/]
						}
					],
					finish: [
						{
							pathname: [/\.*/],
							search: [/datalicious=test_mediamind_finish/]
						}
					]
				},
				prepaid_mobile: {
					consideration: [
						{
							pathname: [/\/mobile\-phones\/prepaid\-mobiles/]
						},
						{
							pathname: [/\/prepaidshop/]
						},
						{
							pathname: [/\/prepaid-mobile/],
							host: [/onlineshop\.telstra\.com\.au/]
						},
						{
							pathname: [/\/latest_offers\/prepaiddeals\//]
						},
						{
							meta_keywords: [/pre-?paid/i,/mobile/i,/phone/i,/^(?!.*business)/i]
						}
					],
					start: [
						{
							pathname: [/\/prepaid-mobile\/checkout(?!\/(submitOrder|ordersuccess))/]
						},
						{
							pathname: [/prepaid-mobile/],
							defer: function (cB) {
								bindToClass('storeLocator', 'click', cB);
								bindToClass('shopLocator', 'click', cB);
								bindToClass('LiveChat', 'click', cB);
								bindToClass('live-chat-link', 'click', cB);
							}
						}
					],
					finish: [
						{
							pathname: [/prepaid-mobile\/checkout\/(submitOrder|ordersuccess)/],
							events: /purchase/
						}
					]
				},
				galaxy_s4: {
					consideration: [ { pathname: [/mobile-phones\/mobile-phones\/samsung\/samsung-galaxy-s4/i] } ],
					start: [
						{
							channel: /postpaidshop/i,
							events: /event25/i,
							custom: function(){
								if (/galaxy-s4/i.test(window.location.pathname)){
									document.cookie = 'galaxyPurchase=true;path=/';
									return true;
								}
							}
						}
					],
					finish: [
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/\/mobileshop\/orderconfirmation/],
							events: /purchase/,
							custom: function checkProd() {
								if (/galaxyPurchase=true/i.test(document.cookie)){
									document.cookie = 'galaxyPurchase=;path=/';
									return true;
								}
							}
						}
					]
				},
				postpaid_mobile: {
					consideration: [
						{
							pathname: [/\/mobile\-phones\/mobile\-(plans|phones)/, /^(?!.*(no-lock-in-plans))/i, /^(?!.*(byo))/],
							hash: [/^(?!.*#samsung-galaxy-tab)/i]
						},
						{
							pathname: [/latest\-offers\/samsung\-galaxy\-sii\-4g/i],
							hash: [/^(?!.*#samsung-galaxy-tab)/i]
						},
						{
							pathname: [/^(?!.*(prepaid-mobile|bundles))/i],
							host: [/onlineshop\.telstra\.com\.au/],
							hash: [/^(?!.*#samsung-galaxy-tab)/i]
						},
						{
							pathname: [/\/latest-offers\/(nokia-lumia|sony-xperia|htc-one)/i]
						},
						{
							pathname: [/\/latest-offers\/htc-one-xl\//],
							hash: [/^(?!.*#samsung-galaxy-tab)/i]
						},
						{
							meta_keywords: [/post-?paid/i,/mobile/i,/phone/i,/^(?!.*business)/i],
							hash: [/^(?!.*#samsung-galaxy-tab)/i]
						}
					],
					start: [
						{
							pathname: [/mobileshop\/orderflow/],
							host: [/onlineshop\.telstra\.com\.au/],
							custom: function checkReferrer() {
								return (document.referrer !== document.location.href) && !function(){try{return omnitureData.tms.model.cartLineItems.isBYO} catch (e) {return false}}();
							}
						},
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/^(?!.*prepaid-mobile)/i],
							defer: function(cB) {
								bindToClass('live-chat-link', 'click', cB);
							}
						},
						{
							channel: /postpaidshop/i,
							events: /event25/i,
							custom: function checkReferrer() {
								return (document.referrer !== document.location.href) && !function(){try{return omnitureData.tms.model.cartLineItems.isBYO} catch (e) {return false}}();
							}
						}
					],
					finish: [
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/\/mobileshop\/orderconfirmation/],
							events: /purchase/,
							custom: function checkProds() {
								return /^(?!.*NOLOCKIN-BYO)/i.test(s.products) && /^(?!.*BYO)/i.test(s.products)
							}
						}
					]
				},
				postpaid_mobile_byo: {
					consideration: [
						{
							meta_keywords: [/byo/i, /^(?!.*no lock[\- ]?in)/]
						}
					],
					start: [
						{
							pathname: [/mobileshop\/orderflow/],
							host: [/onlineshop\.telstra\.com\.au/],
							custom: function checkReferrer() {
								return (document.referrer !== document.location.href) && function(){try{return omnitureData.tms.model.cartLineItems.isBYO} catch (e) {return false}}();
							}
						}
					],
					finish: [
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/\/mobileshop\/orderconfirmation/],
							events: /purchase/,
							custom: function checkProds() {
								return (document.referrer !== document.location.href) && /^(?!.*NOLOCKIN-BYO)/i.test(s.products) && /BYO/i.test(s.products)
							}
						}
					]
				},
				no_lock_in: {
					consideration: [
						{
							meta_keywords: [/no lock[\- ]?in/i]
						}
					],
					start: [
						{
							pathname: [/mobile-phones\/plans\/buy/],
							host: [/onlineshop\.telstra\.com\.au/],
							custom: function checkBYO() {
								return function(){try{return omnitureData.tms.model.cartLineItems.isBYO} catch (e) {return false}}();
							}
						}
					],
					finish: [
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/\/mobileshop\/orderconfirmation/],
							events: /purchase/,
							custom: function checkProds() {
								return (document.referrer !== document.location.href) && /NOLOCKIN-BYO/i.test(s.products)
							}
						}
					]
				},
				fixed_broadband: {
					consideration: [
						{
							pathname: [/internet\/home\-broadband[\/\-](bigpond\-elite\-plans|bigpond\-ultimate\-plans)?/]
						},
						{
							pathname: [/internet\/national-broadband-network/]
						},
						{
							pathname: [/online-shop\/home\-broadband\.cfm/]
						},
						{
							meta_keywords: [/fixed/i,/broadband/i,/^(?!.*business)/i]
							}
					],
					start: [
						{
							pathname: [/internet\/home\-broadband\/?((\-bigpond\-(ultimate|elite)\-plans|\/national-broadband-network)|online-shop\/home\-broadband\.cfm)/i],
							defer: function (cB) {
								bindToLinkWithText(/Buy/i, 'click', cB);
								bindToLinkWithText(/Join/i, 'click', cB);
							}
						}
					]
				},
				postpaid_tablet: {
					consideration: [
						{
							pathname: [/online-shop\/tablets\.cfm|tablets\/tablet-devices/]
						},
						{
							pathname: [/internet\/mobile\-tablets\/(?!pre\-paid\-for\-tablets)/]
						},
						{
							hash: [/#samsung-galaxy-tab/i]
						},
						{
							meta_keywords: [/post/i,/paid/i,/tablet/i,/^(?!.*business)/i]
						}
					],
					start: [
						{
							pathname: [/online-shop\/tablet/],
							search: [/device\=/],
							oldShop: true
						},
						{
							pathname: [/mobile\-tablets/, /^(?!.*pre-paid-for-tablets)/i],
							defer: function(cB) {
								bindToClass('storeLocator', 'click', cB);
								bindToClass('shopLocator', 'click', cB);
								bindToLinkWithText(/Chat\ to\ an\ Online\ Consultant/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
							}
						},
						{
							pathname: [/\/webforms\/ipad-shop\//]
						}
					],
					finish: [
						{
							pathname: [/online\-shop\/order\-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /postpaid_tablet/
						},
						{
							pathname: [/\/webforms\/ipad-shop\/order-complete\.cfm/],
							events: /purchase/
						}
					]
				},
				prepaid_tablet: {
					consideration: [
						{
							pathname: [/internet\/mobile\-tablets\/pre\-paid\-for\-tablets/]
						},
						{
							meta_keywords: [/prepaid/i,/tablet/i,/^(?!.*business)/i]
						}
					]
				},
				prepaid_wireless_broadband: {
					consideration: [
						{
							pathname: [/internet\/mobile-broadband[-\/]prepaid/i]
						},
                        {
							pathname: [/online-shop\/mobile-broadband\.cfm|\/latest_offers\/wantwifi/i],
                            hash: [/pre-?paid/i]
						},
						{
							meta_keywords: [/wireless|mobile/i, /broadband/i, /pre[- ]?paid/i, /^(?!.*business)/i, /^(?!.*post[- ]?paid)/i]
						}
					],
					start: [
                        {
							pathname: [/online-shop\/mobile-broadband\.cfm/i],
                            hash: [/pre-?paid/i],
							defer: function(cB) {
								bindToLinkWithText(/Buy/i, 'click', cB);
								bindToLinkWithText(/Join/i, 'click', cB);
							}
						},
						{
							pathname: [/internet\/mobile-broadband[-\/]prepaid/],
							defer: function(cB) {
								bindToClass('storeLocator', 'click', cB);
								bindToClass('shopLocator', 'click', cB);
							}
						},
						{
							pathname: [/online-shop\/mobile-broadband/],
							search: [/=prepaid/],
							oldShop: true
						}
					],
					finish: [
						{
							pathname: [/online\-shop\/order\-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /prepaid_wireless_broadband/
						}
					]
				},
				postpaid_wireless_broadband: {
					consideration: [
						{
							pathname: [/internet\/mobile-broadband-bigpond-liberty-plans/i]
						},
						{
							pathname: [/internet\/mobile-broadband[-\/](plans|devices)/i]
						},
						{
							pathname: [/online-shop\/mobile-broadband\.cfm/i],
                            hash: [/mobile-broadband/i, /^(?!.*pre-?paid)/i]
						},
						{
							meta_keywords: [/wireless|mobile/i, /broadband/i, /post[- ]?paid/i, /^(?!.*business)/i, /^(?!.*pre[- ]?paid)/i],
                            hash: [/^(?!.*pre-?paid)/i]
						}
					],
					start: [
						{
							pathname: [/internet\/mobile-broadband-bigpond-liberty-plans/i],
							defer: function(cB) {
								bindToLinkWithText(/Buy/i, 'click', cB);
								bindToLinkWithText(/Join/i, 'click', cB);
							}
						},
						{
							pathname: [/online-shop\/mobile-broadband\.cfm/i],
                            hash: [/mobile-broadband/i, /^(?!.*pre-?paid)/i],
							defer: function(cB) {
								bindToLinkWithText(/Buy/i, 'click', cB);
								bindToLinkWithText(/Join/i, 'click', cB);
							}
						},
						{
							pathname: [/online-shop\/mobile-broadband/],
							search: [/device\=/, /^(?!.*prepaid)/i],
							oldShop: true
						}
					],
					finish: [
						{
							pathname: [/online\-shop\/order\-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /postpaid_wireless_broadband/
						}
					]
				},
				bundles: {
					consideration: [
						{
							host: [/onlineshop\.telstra\.com\.au/],
							pathname: [/\/bundles/]
						},
						{ meta_keywords: [/bundles/i,/^(?!.*business)/i] }
					],
					start: [
						{
							pathname: [/\/bundles\/(small|medium|large|x-large)/]
						},
						{
							host: [/online\.telstra\.com\.au/],
							pathname: [/\/bundles/],
							defer: function(cB) {
								bindToLinkWithText(/Call\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/consultant/i, 'click', cB);
								bindToLinkWithText(/1800/i, 'click', cB);
							}
						}
					],
					finish: [
						{
							pathname: [/bundle\-save\/order\/confirmation\.cfm/],
							events: /purchase/
						},
						{
							pathname: [/\/bundles\/orderflow\/summary/i],
							events: /purchase/i
						}
					]
				},
				foxtel: {
					consideration: [
						{
							pathname: [/\/tv\/foxtel\-from\-telstra/]
						},
						{
							pathname: [/foxtel\/mobile\.html/]
						},
						{
							meta_keywords: [/foxtel/i, /tv/i, /^(?!.*business)/i]
						}
					],
					start: [
						{
							pathname: [/\/foxtel\/get\.cfm|\/foxtel-from-telstra\.cfm/]
						},
						{
							pathname: [/foxtel/],
							defer: function(cB) {
								bindToClass('storeLocator', 'click', cB);
								bindToClass('shopLocator', 'click', cB);
							}
						}
					],
					finish: [
						{
								channel: /foxtel/i,
								events: /purchase/i
						}
					]
				},
				t_box: {
					consideration: [
						{ pathname: [/\/tv\/tbox/] },
						{ meta_keywords: [/t-box/i,/^(?!.*business)/i] }
					],
					start: [
						{
							pathname: [/online-shop\/standalone-product\.cfm/],
							search: [/device\=telstra-tbox/],
							oldShop: true
						},
						{
							pathname: [/tbox/],
							defer: function (cB) {
								bindToClass('storeLocator', 'click', cB);
								bindToClass('shopLocator', 'click', cB);
								bindToLinkWithText(/Chat\ to\ an\ online\ consultant/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
							}
						}
					],
					finish: [
						{
							pathname: [/online-shop\/order-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /t_box/
						}
					]
				},
				t_hub: {
					consideration: [
						{ pathname: [/home\-phone\/thub/] },
						{ meta_keywords: [/t-hub/i,/^(?!.*business)/i] }
					],
					start: [
						{
							pathname: [/online-shop\/standalone-product\.cfm/],
							search: [/device\=telstra-thub/],
							oldShop: true
						},
						{
							pathname: [/thub/],
							defer: function (cB) {
								bindToClass('storeLocator','click',cB);
								bindToClass('shopLocator','click',cB);
							}
						}
					],
					finish: [
						{
							pathname: [/online-shop\/order-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /t_hub/
						}
					]
				},
				pstn: {
					consideration: [
						{
							pathname: [/home-phone/i, /^(?!.*thub)/i]
						},
						{
							meta_keywords: [/home/i, /phone/i,/^(?!.*business)/i,/^(?!.*moving)/i]
						}
					],
					start: [
						{
							pathname: [/online-shop\/home-phones/i],
							oldShop: true
						}
					],
					finish: [
						{
							pathname: [/online-shop\/order-complete\.cfm/i],
							events: /purchase/,
							product_category_cookie: /pstn/
						}
					]
				},
				business_postpaid_mobile: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/mobiles/] }
					],
					start: [
						{
							pathname: [/online-shop\/business\/business-phone-product\.cfm/],
							oldShop: true
						}
					],
					finish: [
						{
							pathname: [/online-shop\/business\/order-complete\.cfm/],
							events: /purchase/,
							product_category_cookie: /postpaid_mobile/
						}
					]
				},
				business_fixed_broadband: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/internet-data\/ethernet-dsl/] },
						{ pathname: [/business-enterprise\/business-products\/internet-data\/national-broadband-network/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/business-products\/internet-data\/(national-broadband-network|ethernet-dsl)/],
							defer: function(cB) {
								bindToClass('live-chat-link', 'click', cB);
								bindToLinkWithText(/Email us/i, 'click', cB);
								bindToLinkWithText(/Visit a store/i, 'click', cB);
								bindToLinkWithText(/Shop online/i, 'click', cB);
							}
						}
					]
				},
				business_postpaid_tablet: {
					consideration: [
						{ pathname: [/\/business-enterprise\/business-products\/internet-data\/devices\/internet-tablets/i] }
					],
					start: [
						{
							pathname: [/online-shop\/business\/business-tablet-(plan|product)\.cfm/i],
							oldShop: true
						}
					],
					finish: [
						{
							pathname: [/online-shop\/business\/order-complete\.cfm/],
							events: /purchase/,
							product_category_cookie: /business_postpaid_tablet/
						}
					]
				},
				business_wireless_broadband: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/internet-data\/(plans-pricing|devices)\/mobile-(broadband|wi-fi)/] },
						{ pagename: /the overland office$/i },
						{ channel: /business-enterprise/i, meta_keywords: [/business mobile broadband/i] }
					],
					start: [
						{
							pathname: [/online-shop\/business\/business-mobile-broadband-(plan|product)\.cfm/],
							oldShop: true
						}
					],
					finish: [
						{
							events: /purchase/,
							product_category_cookie: /wireless_broadband/
						}
					]
				},
				business_bundles: {
					consideration: [
						{ pathname: [/business-enterprise\/bundles/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/bundles/],
							defer: function(cB) {
								bindToLinkWithText(/Call\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/consultant/i, 'click', cB);
								bindToLinkWithText(/1800/i, 'click', cB);
								bindToLinkWithText(/Shop online/i, 'click', cB);
							}
						}
					]
				},
				business_landlines: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/telephony/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/business-products\/telephony/],
							defer: function(cB) {
								bindToLinkWithText(/Call\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/consultant/i, 'click', cB);
								bindToLinkWithText(/1800/i, 'click', cB);
								bindToLinkWithText(/Shop online/i, 'click', cB);
							}
						}
					]
				},
				business_cloud_service: {
					consideration: [
						{ pathname: [/business-enterprise\/enterprise-solutions\/cloud-services/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/enterprise-solutions\/cloud-services/],
							defer: function(cB) {
								bindToLinkWithText(/Call\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/consultant/i, 'click', cB);
								bindToLinkWithText(/1800/i, 'click', cB);
								bindToLinkWithText(/Shop online/i, 'click', cB);
							}
						}
					]
				},
				business_managed_service: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/managed-services/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/business-products\/managed-services/],
							defer: function(cB) {
								bindToLinkWithText(/Call\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/consultant/i, 'click', cB);
								bindToLinkWithText(/1800/i, 'click', cB);
								bindToLinkWithText(/Shop online/i, 'click', cB);
							}
						}
					]
				},
				business_tsuite_software: {
					consideration: [
						{ pathname: [/business-enterprise\/business-products\/t-suite-software/] }
					],
					start: [
						{
							pathname: [/business-enterprise\/business-products\/t-suite-software/],
							defer: function(cB) {
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
								bindToLinkWithText(/Email\ us\ 24x7/i, 'click', cB);
								bindToLinkWithText(/dealers/i, 'click', cB);
								bindToLinkWithText(/buy/i, 'click', cB);
							}
						}
					]
				},
				customer_service: {
					consideration: [
						{
							custom: function checkProps() {
								return (/myaccount:login - my account/i.test(s.pageName));
							}
						}
					],
					start: [
						{
							custom: function checkProps() {
								return (/myaccount:login - my account/i.test(s.pageName));
							}
						}
					],
					finish: [
						{
							custom: function checkProps() {
								return (/myaccount:overview - my account$/i.test(s.pageName));
							}
						}
					]
				},
				online_billing: {
					consideration: [
						{
							custom: function checkProps() {
								return (/event23/i.test(s.events) && (/OnlineBilling/i.test(s.prop26)) || /BillPayment/i.test(s.prop27));
							}
						}
					],
					start: [
						{
							custom: function checkEvent() {
								return (/event23/i.test(s.events) && (/OnlineBilling/i.test(s.prop26) || /BillPayment/i.test(s.prop27)));
							}
						}
					],
					finish: [
						{
							custom: function checkProps() {
								return (/event24/i.test(s.events) && (/OnlineBilling/i.test(s.prop26) || /BillPayment/i.test(s.prop27)));
							}
						}
					]
				},
				international_roaming: {
					consideration: [
						{channel: /InternationalRoaming/i},
						{meta_keywords: [/international/i,/roaming/i]},
						{pathname: [/international-roaming\/index/i]}
					],
					start: [
						{pathname: /(data-pack|activate-roaming-data-pack)\/index/i,
                         channel: /InternationalRoaming/i}
					],
					finish: [
						{pathname: [/thankyou\.cfm$/i],
						 channel: /InternationalRoaming/i}
					]
				},
				moving_home: {
					consideration: [
						{
							meta_keywords: [/moving/i, /relocate/i, /move (house|home)/i]
						},
						{
							pathname: [/^\/moving-home\//i]
						},
						{
							channel: /movinghome/i
						}
					],
					start: [
						{
							pathname: [/^\/webforms\/(moving-home|move-to-telstra)/i]
						},
						{
							channel: /movinghome/i,
							events: /scView/i
						}
					],
					finish: [
						{
							channel: /movinghome/i,
							events: /purchase/i
						}
					]
				},
				personal_shopping: {
					start: [
						{
							meta_keywords: [/personal[- _]shopping/i, /appointment/i]
						},
						{
							pathname: [/personal-shopping\/booking\.cfm/i]
						}
					],
					finish: [
						{
							pathname: [/personal-shopping\/booking\.cfm/],
							custom: function() {
								return document.getElementById('wrap-comment-add') !== null;
							}
						}
					]
				},
				store_finder: {
					start: [
						{
							channel: /store-locator/i
						}
					],
					finish: [
						{
							channel: /store-locator/i,
							search: [/^\?map/i]
						}
					]
				},
				business_customer_service: {
					consideration: [
						{
							pagename: /TD:BUS:selfservice:login-start-home/i
						}
					],
					start: [
						{
							pagename: /TD:BUS:selfservice:login-start-home/i
						}
					],
					finish: [
						{
							pagename: /TD:BUS:myaccount:myaccount:dashboard-myaccount:dashboard:home/i
						}
					]
				},
				teg_clever_aust:{
					consideration: [
						{ pagename: /clever australians - (linfox|arrium|afl|komatsu|nissan|me[- ]?bank|australia[ -]post)$/i },
						{ meta_keywords: [/case study/i, /business enterprise/i, /linfox|arrium|afl|komatsu|nissan|me[- ]?bank|australia[ -]post/i] },
                        { pathname: [/clever-australians\/nissan-leaf-m2m/i] }
					],
					start: [
						{
							pagename: /clever australians - (linfox|arrium|afl|komatsu|nissan|me[- ]?bank|australia[ -]post)$/i,
							defer: function(cB) {
								bindToClass('popupDoc', 'click', cB);
								bindToLinkWithText(/m2m/i, 'click', cB);
							}
						},
                        {
                            pathname: [/clever-australians\/nissan-leaf-m2m/i],
                            defer: function(cB) {
								bindToClass('popupDoc', 'click', cB);
								bindToLinkWithText(/m2m/i, 'click', cB);
							}
						}
					],
					finish: [
						{
							pagename: /clever australian enquiry$/i
						}
					]
				},
				generic: {
					consideration: [
						{
							events: /prodView/i
						}
					],
					start: [
						{
							custom: function checkEvent() {
								return (/Start/i.test(s.prop25));
							},
							defer: function (cB) {
								bindToClass('storeLocator','click',cB);
								bindToClass('shopLocator','click',cB);
								bindToLinkWithText(/Chat\ to\ an\ Online\ Consultant/i, 'click', cB);
								bindToLinkWithText(/Live\ Chat\ 24x7/i, 'click', cB);
							}
						}
					],
					finish: [
						{
							events: /purchase/
						}
					]
				}
			};

			var testRules = (function () {
				var locationElements = ['pathname', 'search', 'href', 'host', 'hash'];
				var ruleTypes = ['finish', 'start', 'consideration']; /* The order of this array is very important. */
				var alreadyFiredConversion = false;
				var testRule = function (rule) {
					/* Returns true or false */
					var i, j, matchesLocationElement, element;
					/* Test the pathname, href and search */
					for (i = 0; i < locationElements.length; i += 1) {
						if (rule.hasOwnProperty(locationElements[i])) {
							element = locationElements[i];
							matchesLocationElement = false;
							/* Test that it satisfies all the expressions specified */
							for (j = 0; j < rule[element].length; j += 1) {
								if (!rule[element][j].test(window.location[element])) {
									return false;
								}
							}
						}
					}
					/* Test Omniture events */
					if (rule.hasOwnProperty('events') && !rule.events.test(s.events)) {
						return false;
					}
					/* Test Omniture pageName */
					if (rule.hasOwnProperty('pagename') && !rule.pagename.test(s.pageName)) {
						return false;

					}
					/* Test Omniture Channel */
					if (rule.hasOwnProperty('channel') && !rule.channel.test(s.channel)) {
						return false;
					}
                    /* Test Referrer */
					if (rule.hasOwnProperty('referrer') && !rule.referrer.test(document.referrer)) {
						return false;
					}
					/* Run any custom logic */
					if (rule.hasOwnProperty('custom') && !rule.custom()) {
						return false;
					}
					/* Test for the product category cookie */
					if (rule.hasOwnProperty('product_category_cookie') && !rule.product_category_cookie.test(productCookieValue)) {
						return false;
					}
					/* Test Meta tag Keywords */
					if (rule.hasOwnProperty('meta_keywords')) {
						var getMetaKeywords = function(){
							var metas = document.getElementsByTagName('meta');
							var kw = '';
							for (var i = 0; i < metas.length; i++){
								if (metas[i].name.toLowerCase() === 'keywords'){
									kw += metas[i].content;
								}
							}
							return kw;
						};
						var kw = getMetaKeywords();
						for (i = 0; i < rule.meta_keywords.length; i++){
							if (!rule.meta_keywords[i].test(kw)) {
								return false;
							}
						}
					}
					return true;
				};

				var onFindMatch = function (ruleName, ruleType, rule) { /* We run this when a rule is satisfied */
					if (ruleType === 'finish') {
						if (alreadyFiredConversion === true) {
							return;
						}
						alreadyFiredConversion = true;
					}
					fireTagContainer(ruleName, ruleType);
					if (rule.oldShop) {trackOldShop(ruleName);}

					if (/consideration|start/.test(ruleType)) { /* Store the user's stage in a 30-day cookie */
						funnelStageCookieValue = ruleType;
						setDatCookie(funnelStageCookieName, ruleType, 30, '.telstra.com.au');
					} else if (ruleType === 'finish') { /* Delete the cookies storing the product category and funnel stage */
						setDatCookie(productCookieName, '', 0, '.telstra.com.au');
						setDatCookie(funnelStageCookieName, '', 0, '.telstra.com.au');
					}
				};

				var makeMatchHandler = function (ruleName, ruleType, rule) {
					return function () {
						onFindMatch(ruleName, ruleType, rule);
					};
				};

				return function testRules(rules) {
					var ruleName, i, j, matches, rule;
					ruleLoop: for (i = 0; i < ruleTypes.length; i += 1) {
						if (ruleTypes[i] === 'consideration' && funnelStageCookieValue === 'start') {
							continue; /* We never want to fire consideration if the user has started a funnel in the last 30 days */
						}

						for (ruleName in rules) {
							if (!rules.hasOwnProperty(ruleName) || !rules[ruleName].hasOwnProperty(ruleTypes[i])) {
								continue; /* Either this is not a rule or this rule does not have a rule of this type */
							}

							for (j = 0; j < rules[ruleName][ruleTypes[i]].length; j += 1) {
								rule = rules[ruleName][ruleTypes[i]][j]; /*  Get the rule for convenience */
								matches = testRule(rule); /* Test whether this rule matches the current page view */
								if (matches) { /* Do we fire the tag immediately, or bind it to some other event? ('defer' it) */
									if (rule.hasOwnProperty('defer')) {
										rule.defer(makeMatchHandler(ruleName, ruleTypes[i], rule)); /*  Note - we do not break when we bind a handler. */
									} else {
										onFindMatch(ruleName, ruleTypes[i], rule);
										break ruleLoop; /* We have found an applicable rule to be fired - stop checking the conditions. */
									}
								}
							}
						}
					}
				};
			}());

			return function track() {
				/* Are we on a landing page? */
				try{
					adserver.mediaChannel.exec();
					if (adserver.mediaChannel.trafficSource.length > 0 && (typeof s.eVar16 !== 'undefined' && s.eVar16.length > 0)) {
						fireTagContainer('landing_page');
					}
				}catch(e){}
				/* Run the funnel tracking code */
				testRules(funnelRules);
			};
		}())
	},
	remarketingTags : {
		conversionId: "961682341",
		pixelUrl: function (label) {
				return "//www.googleadservices.com/pagead/conversion/" + this.conversionId + "/?label=" + label + "&amp;guid=ON&amp;script=0";
		},
		firePixel: function (label) {
			var	img = document.createElement('img');
			img.style.display = 'none'; img.height = 1;
			img.src = this.pixelUrl(label);
			body = document.getElementsByTagName('body')[0];
			body.appendChild(img);
		},
		postpaidshop: {
			'S|PostpaidShop|SmallPlan|'				:'QDsDCOvJ6QQQpbfIygM',
			'S|PostpaidShop|MedPlan|'				:'KN5KCOPK6QQQpbfIygM',
			'S|PostpaidShop|LargePlan|'				:'DrECCNvL6QQQpbfIygM',
			'S|PostpaidShop|XLargePlan|'			:'tsUSCNPM6QQQpbfIygM',
			'S|PostpaidShop|$60PlanSmall|'			:'WLtuCOuF6gQQpbfIygM',
			'S|PostpaidShop|$80PlanMed|'			:'-TU0CNOI6gQQpbfIygM',
			'S|PostpaidShop|$100PlanLarge|'			:'HBMKCMuJ6gQQpbfIygM',
			'S|PostpaidShop|$130PlanXLarge|'		:'Vn0bCMOK6gQQpbfIygM',
			'S|PostpaidShop|AndroidOS|'				:'IjS3CLuL6gQQpbfIygM',
			'S|PostpaidShop|AppleOS|'				:'p_82CLOM6gQQpbfIygM',
			'S|PostpaidShop|WindowsOS|'				:'l1qcCKuN6gQQpbfIygM',
			'S|PostpaidShop|BlackberryOS|'			:'OXsbCKPGnwUQpbfIygM',
			'S|PostpaidShop|OtherOS|'				:'A2kfCJvHnwUQpbfIygM',
			'S|PostpaidShop|BlackColour|'			:'tNAqCJPInwUQpbfIygM',
			'S|PostpaidShop|WhiteColour|'			:'ja9qCIvJnwUQpbfIygM',
			'S|PostpaidShop|RedColour|'				:'g5RtCIPKnwUQpbfIygM',
			'S|PostpaidShop|YellowColour|'			:'4i_HCPvKnwUQpbfIygM',
			'S|PostpaidShop|BlueColour|'			:'gvrYCPPLnwUQpbfIygM',
			'S|PostpaidShop|GreyColour|'			:'mwEXCOvMnwUQpbfIygM',
			'S|PostpaidShop|SilverColour|'			:'XuKHCOPNnwUQpbfIygM',
			'S|PostpaidShop|OtherColour|'			:'lsO4CNvOnwUQpbfIygM',
			'S|PostpaidShop|AddonsComplete|'		:'jR3FCKOO6gQQpbfIygM',
			'S|PostpaidShop|PersonalDetailsComplete|':'U2pcCJuP6gQQpbfIygM',
			'S|PostpaidShop|NumberChoiceComplete|'	:'8o8iCJOQ6gQQpbfIygM',
			'S|PostpaidShop|ContactDetailsComplete|':'0CwPCIuR6gQQpbfIygM',
			'S|PostpaidShop|HomeAddressComplete|'	:'tiTbCMPCnwUQpbfIygM',
			'S|PostpaidShop|DeliveryAddressComplete|':'brbaCIOS6gQQpbfIygM',
			'S|PostpaidShop|ResidenceAddressComplete|':'EkY3CPOT6gQQpbfIygM',
			'S|PostpaidShop|IDComplete|'			:'OcdkCOuU6gQQpbfIygM',
			'S|PostpaidShop|OccupationDetailsComplete|'	:'43zzCOOV6gQQpbfIygM',
			'S|PostpaidShop|BillingPreferenceComplete|'	:'dgi9CNOX6gQQpbfIygM',
			'S|PostpaidShop|T&CsAcceptedComplete|'	:'f2WFCMuY6gQQpbfIygM',
			'S|PostpaidShop|PlaceOrderComplete|'	:'Yr3zCMOZ6gQQpbfIygM',
			'S|PostpaidShop|OrderDecline|'			:'0z23CPOi6gQQpbfIygM',
			'S|PostpaidShop|BYO$50PlanSmall|'		:'Gtp6CLua6gQQpbfIygM',
			'S|PostpaidShop|BYO$60PlanSmall|'		:'Gtp6CLua6gQQpbfIygM',
			'S|PostpaidShop|BYO$60PlanMed|'			:'LSaJCLOb6gQQpbfIygM',
			'S|PostpaidShop|BYO$80PlanMed|'			:'LSaJCLOb6gQQpbfIygM',
			'S|PostpaidShop|BYO$80PlanLarge|'		:'JtXECKuc6gQQpbfIygM',
			'S|PostpaidShop|BYO$100PlanLarge|'		:'JtXECKuc6gQQpbfIygM',
			'S|PostpaidShop|BYO$100PlanXLarge|'		:'TEszCKOd6gQQpbfIygM',
			'S|PostpaidShop|BYO$130PlanXLarge|'		:'TEszCKOd6gQQpbfIygM',
			'S|PostpaidShop|BYOPhoneSIMTypeSelectComplete|':'iEnGCJue6gQQpbfIygM'
		}
	},
	mediaChannel: {
		campaignCode: '',
		brandTerms: 'telstra,bigpond,foxtel,thub,tbox,t-hub,t-box,big+pond,sensis',
		internalDomains: '',
		trafficSource: '',
		searchKeyword: '',
		semIdentifierParameterList: 'tc,gclid,s_kwcid',
		seKeyString: '',
		socialMediaDomains: '',

		getHostName: 0,
		getParameterValue: 0,
		getSearchKeyword: 0,
		isBrandedKeyword: 0,
		isPaidTraffic: 0,
		getSocialMediaDomain: 0,

		init: function(){
			if(typeof purchasePath !== 'undefined' && typeof s !== 'undefined'){
				this.internalDomains= s.linkInternalFilters;
				this.trafficSource= '';
				this.searchKeyword= '';
				this.semIdentifierParameter= 'tc';
				this.seKeyString= purchasePath.seKeyString;
				this.socialMediaDomains= purchasePath.socialMediaDomains;

				this.getHostName= purchasePath.getHostName;
				this.getParameterValue= purchasePath.getParameterValue;
				this.getSearchKeyword= purchasePath.getSearchKeyword;
				this.isBrandedKeyword= purchasePath.isBrandedKeyword;
				this.isPaidTraffic= purchasePath.isPaidTraffic;
				this.getSocialMediaDomain= purchasePath.getSocialMediaDomain;
				return true;
			}
			return false;
		},

		isSearchEngine: function(host){
			return RegExp(this.seKeyString.replace(/:[^,]+/g,'').replace(/,/g,'|')).test(host.toLowerCase());
		},

		isInternalDomain: function(domain){
			var ints = this.internalDomains.split(',');
			domain = domain.replace('www.','');
			for(var i = 0; i < ints.length; i++){
				if(domain.toLowerCase() === ints[i].toLowerCase())
					return true;
			}
			return false;
		},

		exec: function(){
			var result = false;
			try{
			if(this.init() && this.trafficSource == ''){
				var referrerHostName = this.getHostName(document.referrer.toLowerCase());
				this.campaignCode = this.getParameterValue(window.location.href,this.semIdentifierParameter) || '';
				var paid = this.isPaidTraffic();
				var tag = '';

				if(this.campaignCode != ''){
					// if there is a campaign code, process it
					this.searchKeyword = this.getSearchKeyword(document.referrer);
					if(this.isSearchEngine(referrerHostName)){
						if(this.searchKeyword === '-na-'){
							// could not determine search keyword, -na- is default
							this.trafficSource = 'sem:' + referrerHostName + ':' + this.campaignCode;
							tag = '//ad.doubleclick.net/clk;261590922;85748264;t';
						}else if(this.isBrandedKeyword(this.searchKeyword)){
							this.trafficSource = 'sem:b:' + referrerHostName + ':' + this.campaignCode;
							tag = '//ad.doubleclick.net/clk;261590947;85781518;z';
						}else{
							this.trafficSource = 'sem:g:' + referrerHostName + ':' + this.campaignCode;
							tag = '//ad.doubleclick.net/clk;261590962;85781643;v';
						}
					}else{
						this.trafficSource = this.campaignCode;
						tag = '//ad.doubleclick.net/clk;261591169;85781873;a';
					}
				}else{
					// no campaign code, work it out from referral url
					if(document.referrer != ''){
						if(this.getHostName(window.location.href.toLowerCase()) != referrerHostName){
							this.searchKeyword = this.getSearchKeyword(document.referrer);
							if(this.isSearchEngine(referrerHostName)){
								// the traffic is from a search engine
								if(this.searchKeyword === '-na-'){
									// -na- is default when keyword could not be determined, eg Google while logged in
									this.trafficSource = 'seo:' + referrerHostName;
									tag = '//ad.doubleclick.net/clk;261591020;85781701;c';
								}else if(this.isBrandedKeyword(this.searchKeyword)){
									this.trafficSource = 'seo:b:'+referrerHostName;
									tag = '//ad.doubleclick.net/clk;261591030;85781723;h';
								}else{
									this.trafficSource = 'seo:g:'+referrerHostName;
									tag = '//ad.doubleclick.net/clk;261591064;85781736;s';
								}
							}else{
								// the traffic is NOT from search engine
								if(this.getSocialMediaDomain(document.referrer) != ''){
									// the traffic is from a social media
									this.trafficSource = 'soc:'+referrerHostName;
									tag = '//ad.doubleclick.net/clk;261591007;85781678;u';
								}else{
									// the traffic is NOT from social media, so it is referral traffic
									// referred by a subdomain?
									if(this.isInternalDomain(referrerHostName)){
										this.trafficSource = 'int:' + referrerHostName;
									}else{
										this.trafficSource = 'ext:' + referrerHostName;
									}
								}
							}
						}else{
							// not a page that needs to be tracked
							this.trafficSource = '';
						}
					}else{
						// no referrer, no campaign, default to direct
						this.trafficSource = 'dir';
					}
				}
				result = true;
				if(this.getParameterValue(window.location.href,'dd') === 'ex') {
					var ifr = document.createElement('iframe');
					// New tag format, don't use buildTargetingTagURL() to prevent it redirecting to this format
					// Need to confirm if new format is fully backwards compatible before migrating old tags
					ifr.src  = '//3603226.fls.doubleclick.net/activityi;src=3603226;type=landi013;cat=landi719;ord='+adserver.datRand;
					ifr.style.display = 'none';
					document.getElementById('adserver_iframe').appendChild(ifr);
				} else if (tag) {
					new Image().src = tag;
				}
			}}catch(e){typeof console !== 'undefined' && console.error(e);}
			return result;
		}
	},
	getZMSsetId: function(username){
		adserver.zMSExecuted = false;
		adserver.extraAdExecuted = false;
		if(adserver.zMSExecuted === false) {
			//zMSid = username.toUpperCase().replace("@BIGPOND.COM", "");
			//zMSid = zMSid.toUpperCase().replace("@TELSTRA.COM", "");
			var zMSid = username.toLowerCase();
			var zMShashed = (s.sha1Hash(zMSid,true).toUpperCase());
			var zMSurl = "//medrx.sensis.com.au/setguid.php?guid="+zMShashed;
			var zMSframe = document.createElement('iframe');
			zMSframe.src = zMSurl;
			zMSframe.id = 'zMSframe';
			zMSframe.user = 'userReg';
			zMSframe.width = 0;
			zMSframe.height = 0;
			zMSframe.frameborder = 0;
			zMSframe.marginWidth = 0;
			zMSframe.marginHeight = 0;
			zMSframe.scrolling = "no";
			zMSframe.style.display = 'none';
			document.body.appendChild(zMSframe);
			setTimeout('adserver.extraAdCall()', 1500)
			adserver.zMSExecuted = true;
		}
	},
	extraAdCall: function(){
		if(adserver.extraAdExecuted === false) {
			var zMSscript = document.createElement('script');
			zMSscript.setAttribute('type', 'text/javascript');
			zMSscript.setAttribute('src', '//medrx.sensis.com.au/online.php');
			document.body.appendChild(zMSscript);
			setTimeout('adserver.extractAdData()', 1500);
			adserver.extraAdExecuted = true;
		}
	},
	extractAdData: function(){
		/* Write the values to a cookie, then read on hte next page, and delete the cookies (in scode) */
		if(typeof extraAdCallInfo !=='undefined'){
		//if(debug)console.log('ads.js sets s_c20');
		s.eVar20=s.prop20=s.getAndPersistValue(extraAdCallInfo,'s_c20',0);
		}
	}
};

/* START: AudienceManager code */
if("function"!=typeof DIL)DIL=function(a,b){var d=[],f,e,g,h,m,o,r;"object"!=typeof a&&(a={});m=!!a.disableDestinationPublishingIframe;o=a.mappings;r=a.uuidCookie;(f=b)&&d.push(f+"");e=a.partner;if(!e||"string"!=typeof e)return f="DIL partner is invalid or not specified in initConfig",DIL.errorModule.handleError({name:"error",message:f,filename:"dil.js"}),Error(f);f="DIL containerNSID is invalid or not specified in initConfig, setting to default of 0";if((g=a.containerNSID)||"number"==typeof g)g=
parseInt(g,10),!isNaN(g)&&0<=g&&(f="");f&&(g=0,d.push(f),f="");h=DIL.getDil(e,g);if(h instanceof DIL&&h.api.getPartner()==e&&h.api.getContainerNSID()==g)return h;if(this instanceof DIL)DIL.registerDil(this,e,g);else return new DIL(a,"DIL was not instantiated with the 'new' operator, returning a valid instance with partner = "+e+" and containerNSID = "+g);var j={IS_HTTPS:"https:"==document.location.protocol,POST_MESSAGE_ENABLED:!!window.postMessage,COOKIE_MAX_EXPIRATION_DATE:"Tue, 19 Jan 2038 03:14:07 UTC"},
t={},k={},n={firingQueue:[],fired:[],firing:!1,sent:[],errored:[],reservedKeys:{sids:!0,pdata:!0,logdata:!0,callback:!0,postCallbackFn:!0,useImageRequest:!0},callbackPrefix:"demdexRequestCallback",firstRequestHasFired:!1,useJSONP:!0,abortRequests:!1,num_of_jsonp_responses:0,num_of_jsonp_errors:0,num_of_img_responses:0,num_of_img_errors:0,adms:{TIME_TO_CATCH_ALL_REQUESTS_RELEASE:500,calledBack:!1,uuid:null,noADMS:!1,instanceType:null,releaseType:"no ADMS",admsProcessingStarted:!1,process:function(c){try{if(!this.admsProcessingStarted){var i=
this,p=a.visitorService,d,f,e,b;if("function"==typeof c&&"function"==typeof c.getDefault&&"function"==typeof c.getInstance&&(p===Object(p)&&(d=p.namespace)&&"string"==typeof d?(this.instanceType="namespace: "+d,f=c.getInstance(d)):(this.instanceType="default",f=c.getDefault()),f===Object(f)&&"function"==typeof f.getVisitorID)){this.admsProcessingStarted=!0;e=function(c){if("ADMS"!=i.releaseType)i.uuid=c,i.releaseType="ADMS",i.releaseRequests()};b=f.getVisitorID(e);if(-1==b){this.releaseType="failed ADMS";
this.releaseRequests();return}if("string"==typeof b&&b.length){e(b);return}setTimeout(function(){if("ADMS"!=i.releaseType)i.releaseType="timeout",i.releaseRequests()},this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE);return}this.noADMS=!0;this.releaseRequests()}}catch(g){this.releaseRequests()}},releaseRequests:function(){this.calledBack=!0;n.registerRequest()}},registerRequest:function(c){var i=this.firingQueue;"object"==typeof c&&i.push(c);if(!this.firing&&i.length)if(this.adms.calledBack){if(c=i.shift(),
v.fireRequest(c),!this.firstRequestHasFired&&"script"==c.tag)this.firstRequestHasFired=!0}else this.processADMS()},processADMS:function(){this.adms.process(window.ADMS)}};h=function(){var c="http://fast.";j.IS_HTTPS&&(c=!0===a.iframeAkamaiHTTPS?"https://fast.":"https://");return c+e+".demdex.net/dest3.html?d_nsid="+g+"#"+encodeURIComponent(document.location.href)};var s={THROTTLE_START:3E4,throttleTimerSet:!1,id:"destination_publishing_iframe_"+e+"_"+g,url:h(),iframe:null,iframeHasLoaded:!1,sendingMessages:!1,
messages:[],messagesPosted:[],messageSendingInterval:j.POST_MESSAGE_ENABLED?15:100,jsonProcessed:[],attachIframe:function(){var c=this,i=document.createElement("iframe");i.id=this.id;i.style.cssText="display: none; width: 0; height: 0;";i.src=this.url;l.addListener(i,"load",function(){c.iframeHasLoaded=!0;c.requestToProcess()});document.body.appendChild(i);this.iframe=i},requestToProcess:function(c){var i=this;c&&!q.isEmptyObject(c)&&this.process(c);if(this.iframeHasLoaded&&this.messages.length&&
!this.sendingMessages){if(!this.throttleTimerSet)this.throttleTimerSet=!0,setTimeout(function(){i.messageSendingInterval=j.POST_MESSAGE_ENABLED?15:150},this.THROTTLE_START);this.sendingMessages=!0;this.sendMessages()}},process:function(c){var i=this.messages,p=encodeURIComponent,a,d,f,b,e;if((a=c.dests)&&a instanceof Array&&(d=a.length))for(f=0;f<d;f++)b=a[f],b=[p("dests"),p(b.id||""),p(b.y||""),p(b.c||"")],i.push(b.join("|"));if((a=c.ibs)&&a instanceof Array&&(d=a.length))for(f=0;f<d;f++)b=a[f],
b=[p("ibs"),p(b.id||""),p(b.tag||""),l.encodeAndBuildRequest(b.url||[],","),p(b.ttl||"")],i.push(b.join("|"));if((a=c.dpcalls)&&a instanceof Array&&(d=a.length))for(f=0;f<d;f++)b=a[f],e=b.callback||{},e=[e.obj||"",e.fn||"",e.key||"",e.tag||"",e.url||""],b=[p("dpm"),p(b.id||""),p(b.tag||""),l.encodeAndBuildRequest(b.url||[],","),p(b.ttl||""),l.encodeAndBuildRequest(e,",")],i.push(b.join("|"));this.jsonProcessed.push(c)},sendMessages:function(){var c=this,i;this.messages.length?(i=this.messages.shift(),
DIL.xd.postMessage(i,this.url,this.iframe.contentWindow),this.messagesPosted.push(i),setTimeout(function(){c.sendMessages()},this.messageSendingInterval)):this.sendingMessages=!1}},x={traits:function(c){if(q.isValidPdata(c)){if(!(k.sids instanceof Array))k.sids=[];l.extendArray(k.sids,c)}return this},pixels:function(c){if(q.isValidPdata(c)){if(!(k.pdata instanceof Array))k.pdata=[];l.extendArray(k.pdata,c)}return this},logs:function(c){if(q.isValidLogdata(c)){if("object"!=typeof k.logdata)k.logdata=
{};l.extendObject(k.logdata,c)}return this},customQueryParams:function(c){q.isEmptyObject(c)||l.extendObject(k,c,n.reservedKeys);return this},signals:function(c,i){var a,b=c;if(!q.isEmptyObject(b)){if(i&&"string"==typeof i)for(a in b={},c)c.hasOwnProperty(a)&&(b[i+a]=c[a]);l.extendObject(k,b,n.reservedKeys)}return this},result:function(c){if("function"==typeof c)k.callback=c;return this},afterResult:function(c){if("function"==typeof c)k.postCallbackFn=c;return this},useImageRequest:function(){k.useImageRequest=
!0;return this},clearData:function(){k={};return this},submit:function(){v.submitRequest(k);k={};return this},getPartner:function(){return e},getContainerNSID:function(){return g},getEventLog:function(){return d},getState:function(){var c={},a={};l.extendObject(c,n,{callbackPrefix:!0,useJSONP:!0,registerRequest:!0});l.extendObject(a,s,{attachIframe:!0,requestToProcess:!0,process:!0,sendMessages:!0});return{pendingRequest:k,otherRequestInfo:c,destinationPublishingInfo:a}},idSync:function(c){if(c!==
Object(c)||"string"!=typeof c.dpid||!c.dpid.length)return"Error: config or config.dpid is empty";if("string"!=typeof c.url||!c.url.length)return"Error: config.url is empty";var a=c.url,b=c.minutesToLive,d=encodeURIComponent,a=a.replace(/^https:/,"").replace(/^http:/,"");if("undefined"==typeof b)b=20160;else if(b=parseInt(b,10),isNaN(b)||0>=b)return"Error: config.minutesToLive needs to be a positive number";c=["ibs",d(c.dpid),"img",d(a),b];s.messages.push(c.join("|"));n.firstRequestHasFired&&s.requestToProcess();
return"Successfully queued"},aamIdSync:function(c){if(c!==Object(c)||"string"!=typeof c.dpuuid||!c.dpuuid.length)return"Error: config or config.dpuuid is empty";c.url="//dpm.demdex.net/ibs:dpid="+c.dpid+"&dpuuid="+c.dpuuid;return this.idSync(c)}},v={submitRequest:function(c){n.registerRequest(v.createQueuedRequest(c));return!0},createQueuedRequest:function(c){var a=n,b,f=c.callback,e="img";if(!q.isEmptyObject(o)){var g,j,h;for(g in o)if(o.hasOwnProperty(g)&&(j=o[g],!(null==j||""===j)&&g in c&&!(j in
c)&&!(j in n.reservedKeys)))h=c[g],null==h||""===h||(c[j]=h)}if(!q.isValidPdata(c.sids))d.push("requestProcs.createQueuedRequest(): sids is not valid, converting to an empty array"),c.sids=[];if(!q.isValidPdata(c.pdata))d.push("requestProcs.createQueuedRequest(): pdata is not valid, converting to an empty array"),c.pdata=[];if(!q.isValidLogdata(c.logdata))d.push("requestProcs.createQueuedRequest(): logdata is not valid, converting to an empty object"),c.logdata={};c.logdataArray=l.convertObjectToKeyValuePairs(c.logdata,
"=",!0);c.logdataArray.push("_ts="+(new Date).getTime());if("function"!=typeof f)f=this.defaultCallback;if(a.useJSONP=!c.useImageRequest||"boolean"!=typeof c.useImageRequest)e="script",b=a.callbackPrefix+(new Date).getTime();return{tag:e,src:v.makeRequestSrc(c,b),internalCallbackName:b,callbackFn:f,postCallbackFn:c.postCallbackFn,useImageRequest:c.useImageRequest,requestData:c}},defaultCallback:function(c){var a,b,d,f,e,g,j,h,k;if((a=c.stuff)&&a instanceof Array&&(b=a.length))for(d=0;d<b;d++)if((f=
a[d])&&"object"==typeof f){e=f.cn;g=f.cv;j=f.ttl;if("undefined"==typeof j||""===j)j=Math.floor(l.getMaxCookieExpiresInMinutes()/60/24);h=f.dmn||"."+document.domain;k=f.type;if(e&&(g||"number"==typeof g))"var"!=k&&(j=parseInt(j,10))&&!isNaN(j)&&l.setCookie(e,g,1440*j,"/",h,!1),t[e]=g}a=c.uuid;if("string"==typeof a&&a.length&&!q.isEmptyObject(r)){b=r.path;if("string"!=typeof b||!b.length)b="/";d=parseInt(r.days,10);isNaN(d)&&(d=100);l.setCookie(r.name||"aam_did",a,1440*d,b,r.domain||"."+document.domain,
!0===r.secure)}!m&&!n.abortRequests&&s.requestToProcess(c)},makeRequestSrc:function(c,a){c.sids=q.removeEmptyArrayValues(c.sids||[]);c.pdata=q.removeEmptyArrayValues(c.pdata||[]);var b=n,d=l.encodeAndBuildRequest(c.sids,","),f=l.encodeAndBuildRequest(c.pdata,","),h=(c.logdataArray||[]).join("&");delete c.logdataArray;var k=j.IS_HTTPS?"https://":"http://",m;m=[];var o,r,t,s;for(o in c)if(!(o in b.reservedKeys)&&c.hasOwnProperty(o))if(r=c[o],o=encodeURIComponent(o),r instanceof Array)for(t=0,s=r.length;t<
s;t++)m.push(o+"="+encodeURIComponent(r[t]));else m.push(o+"="+encodeURIComponent(r));m=m.length?"&"+m.join("&"):"";return k+e+".demdex.net/event?d_nsid="+g+(d.length?"&d_sid="+d:"")+(f.length?"&d_px="+f:"")+(h.length?"&d_ld="+encodeURIComponent(h):"")+m+(b.useJSONP?"&d_rtbd=json&d_jsonv="+DIL.jsonVersion+"&d_dst=1&d_cts=1&d_cb="+(a||""):"")},fireRequest:function(c){"img"==c.tag?this.fireImage(c):"script"==c.tag&&this.fireScript(c)},fireImage:function(c){var a=n,b,e;if(!a.abortRequests)a.firing=!0,
b=new Image(0,0),a.sent.push(c),b.onload=function(){a.firing=!1;a.fired.push(c);a.num_of_img_responses++;a.registerRequest()},e=function(b){f="imgAbortOrErrorHandler received the event of type "+b.type;d.push(f);a.abortRequests=!0;a.firing=!1;a.errored.push(c);a.num_of_img_errors++;a.registerRequest()},b.addEventListener?(b.addEventListener("error",e,!1),b.addEventListener("abort",e,!1)):b.attachEvent&&(b.attachEvent("onerror",e),b.attachEvent("onabort",e)),b.src=c.src},fireScript:function(c){var a=
this,b=n,g,j,h=c.src,m=c.postCallbackFn,k="function"==typeof m;if(!b.abortRequests)b.firing=!0,window[c.internalCallbackName]=function(a){try{a||(a={});var g=c.callbackFn;b.firing=!1;b.fired.push(c);b.num_of_jsonp_responses++;g(a);k&&m(a)}catch(i){i.message="DIL jsonp callback caught error with message "+i.message;f=i.message;d.push(f);i.filename=i.filename||"dil.js";i.partner=e;DIL.errorModule.handleError(i);try{g({error:i.name+"|"+i.message}),k&&m({error:i.name+"|"+i.message})}catch(j){}}finally{b.registerRequest()}},
j=document.createElement("script"),j.addEventListener&&j.addEventListener("error",function(b){f="jsonp script tag error listener received the event of type "+b.type+" with src "+h;a.handleScriptError(f,c)},!1),j.type="text/javascript",j.src=h,g=document.getElementsByTagName("script")[0],g.parentNode.insertBefore(j,g),b.sent.push(c)},handleScriptError:function(c,a){var b=n;d.push(c);b.abortRequests=!0;b.firing=!1;b.errored.push(a);b.num_of_jsonp_errors++;b.registerRequest()}},q={isValidPdata:function(c){return c instanceof
Array&&this.removeEmptyArrayValues(c).length?!0:!1},isValidLogdata:function(c){return!this.isEmptyObject(c)},isEmptyObject:function(c){if("object"!=typeof c)return!0;for(var a in c)if(c.hasOwnProperty(a))return!1;return!0},removeEmptyArrayValues:function(c){for(var a=0,b=c.length,d,f=[],a=0;a<b;a++)d=c[a],"undefined"!=typeof d&&null!=d&&f.push(d);return f}},l={addListener:function(){if(document.addEventListener)return function(c,a,b){c.addEventListener(a,function(c){"function"==typeof b&&b(c)},!1)};
if(document.attachEvent)return function(c,a,b){c.attachEvent("on"+a,function(c){"function"==typeof b&&b(c)})}}(),convertObjectToKeyValuePairs:function(c,a,b){var d=[],a=a||"=",f,e;for(f in c)e=c[f],"undefined"!=typeof e&&null!=e&&d.push(f+a+(b?encodeURIComponent(e):e));return d},encodeAndBuildRequest:function(c,a){return this.map(c,function(c){return encodeURIComponent(c)}).join(a)},map:function(c,a){if(Array.prototype.map)return c.map(a);if(void 0===c||null===c)throw new TypeError;var b=Object(c),
d=b.length>>>0;if("function"!==typeof a)throw new TypeError;for(var f=Array(d),e=0;e<d;e++)e in b&&(f[e]=a.call(a,b[e],e,b));return f},filter:function(c,a){if(!Array.prototype.filter){if(void 0===c||null===c)throw new TypeError;var b=Object(c),d=b.length>>>0;if("function"!==typeof a)throw new TypeError;for(var f=[],e=0;e<d;e++)if(e in b){var g=b[e];a.call(a,g,e,b)&&f.push(g)}return f}return c.filter(a)},getCookie:function(a){var a=a+"=",b=document.cookie.split(";"),d,f,e;for(d=0,f=b.length;d<f;d++){for(e=
b[d];" "==e.charAt(0);)e=e.substring(1,e.length);if(0==e.indexOf(a))return decodeURIComponent(e.substring(a.length,e.length))}return null},setCookie:function(a,b,d,e,f,g){var j=new Date;d&&(d*=6E4);document.cookie=a+"="+encodeURIComponent(b)+(d?";expires="+(new Date(j.getTime()+d)).toUTCString():"")+(e?";path="+e:"")+(f?";domain="+f:"")+(g?";secure":"")},extendArray:function(a,b){return a instanceof Array&&b instanceof Array?(Array.prototype.push.apply(a,b),!0):!1},extendObject:function(a,b,d){var e;
if("object"==typeof a&&"object"==typeof b){for(e in b)if(b.hasOwnProperty(e)&&(q.isEmptyObject(d)||!(e in d)))a[e]=b[e];return!0}return!1},getMaxCookieExpiresInMinutes:function(){return((new Date(j.COOKIE_MAX_EXPIRATION_DATE)).getTime()-(new Date).getTime())/1E3/60}};"error"==e&&0==g&&l.addListener(window,"load",function(){DIL.windowLoaded=!0});var w=function(){z();!m&&!n.abortRequests&&s.attachIframe()},z=function(){m||setTimeout(function(){!n.firstRequestHasFired&&!n.adms.admsProcessingStarted&&
!n.adms.calledBack&&x.submit()},DIL.constants.TIME_TO_DEFAULT_REQUEST)},y=document,u=a.iframeAttachmentDelay;"error"!=e&&(DIL.windowLoaded?w():"complete"!=y.readyState&&"loaded"!=y.readyState?l.addListener(window,"load",w):DIL.isAddedPostWindowLoadWasCalled?l.addListener(window,"load",w):(u="number"==typeof u?parseInt(u,10):0,0>u&&(u=0),setTimeout(w,u||DIL.constants.TIME_TO_CATCH_ALL_DP_IFRAME_ATTACHMENT)));this.api=x;this.getStuffedVariable=function(a){var b=t[a];!b&&"number"!=typeof b&&(b=l.getCookie(a),
!b&&"number"!=typeof b&&(b=""));return b};this.validators=q;this.helpers=l;if(window._dil_unit_tests)this.constants=j,this.pendingRequest=k,this.requestController=n,this.setDestinationPublishingUrl=h,this.destinationPublishing=s,this.requestProcs=v,this.log=d},function(){var a=document,b;if(null==a.readyState&&a.addEventListener)a.readyState="loading",a.addEventListener("DOMContentLoaded",b=function(){a.removeEventListener("DOMContentLoaded",b,!1);a.readyState="complete"},!1)}(),DIL.extendStaticPropertiesAndMethods=
function(a){var b;if("object"==typeof a)for(b in a)a.hasOwnProperty(b)&&(this[b]=a[b])},DIL.extendStaticPropertiesAndMethods({version:"2.10",jsonVersion:1,constants:{TIME_TO_DEFAULT_REQUEST:50,TIME_TO_CATCH_ALL_DP_IFRAME_ATTACHMENT:500},windowLoaded:!1,dils:{},isAddedPostWindowLoadWasCalled:!1,isAddedPostWindowLoad:function(a){this.isAddedPostWindowLoadWasCalled=!0;this.windowLoaded="function"==typeof a?!!a():"boolean"==typeof a?a:!0},create:function(a){try{return new DIL(a)}catch(b){return(new Image(0,
0)).src="http://error.demdex.net/event?d_nsid=0&d_px=14137&d_ld=name%3Derror%26filename%3Ddil.js%26partner%3Dno_partner%26message%3DError%2520in%2520attempt%2520to%2520create%2520DIL%2520instance%2520with%2520DIL.create()%26_ts%3D"+(new Date).getTime(),Error("Error in attempt to create DIL instance with DIL.create()")}},registerDil:function(a,b,d){b=b+"$"+d;b in this.dils||(this.dils[b]=a)},getDil:function(a,b){var d;"string"!=typeof a&&(a="");b||(b=0);d=a+"$"+b;return d in this.dils?this.dils[d]:
Error("The DIL instance with partner = "+a+" and containerNSID = "+b+" was not found")},dexGetQSVars:function(a,b,d){b=this.getDil(b,d);return b instanceof this?b.getStuffedVariable(a):""},xd:{postMessage:function(a,b,d){var f=1;if(b)if(window.postMessage)d.postMessage(a,b.replace(/([^:]+:\/\/[^\/]+).*/,"$1"));else if(b)d.location=b.replace(/#.*$/,"")+"#"+ +new Date+f++ +"&"+a}}}),DIL.errorModule=function(){var a=DIL.create({partner:"error",containerNSID:0,disableDestinationPublishingIframe:!0}),
b={harvestererror:14138,destpuberror:14139,dpmerror:14140,generalerror:14137,error:14137,noerrortypedefined:15021,evalerror:15016,rangeerror:15017,referenceerror:15018,typeerror:15019,urierror:15020};return{handleError:function(d){var f=d.name?(new String(d.name)).toLowerCase():"",e=[],d={name:f,filename:d.filename?d.filename+"":"",partner:d.partner?d.partner+"":"no_partner",site:d.site?d.site+"":document.location.href,message:d.message?d.message+"":""};e.push(f in b?b[f]:b.noerrortypedefined);a.api.pixels(e).logs(d).useImageRequest().submit()},
pixelMap:b}}();DIL.tools={};
DIL.tools.getSearchReferrer=function(a,b){var d=DIL.getDil("error"),f=DIL.tools.decomposeURI(a||document.referrer),e="",g="",h={queryParam:"q"},e=d.helpers.filter(["object"==typeof b?b:{},{hostPattern:/aol\./},{hostPattern:/ask\./},{hostPattern:/bing\./},{hostPattern:/google\./},{hostPattern:/yahoo\./,queryParam:"p"}],function(a){return!(!a.hasOwnProperty("hostPattern")||!f.hostname.match(a.hostPattern))}).shift();return!e?{valid:!1,name:"",keywords:""}:{valid:!0,name:f.hostname,keywords:(d.helpers.extendObject(h,
e),g=h.queryPattern?(e=(""+f.search).match(h.queryPattern))?e[1]:"":f.uriParams[h.queryParam],decodeURIComponent(g||"").replace(/\+|%20/g," "))}};
DIL.tools.decomposeURI=function(a){var b=DIL.getDil("error"),d=document.createElement("a");d.href=a||document.referrer;return{hash:d.hash,host:d.host.split(":").shift(),hostname:d.hostname,href:d.href,pathname:d.pathname.replace(/^\//,""),protocol:d.protocol,search:d.search,uriParams:function(a,d){b.helpers.map(d.split("&"),function(b){b=b.split("=");a[b.shift()]=b.shift()});return a}({},d.search.replace(/^(\/|\?)?|\/$/g,""))}};
DIL.tools.getMetaTags=function(){var a={},b=document.getElementsByTagName("meta"),d,f,e,g,h;for(d=0,e=arguments.length;d<e;d++)if(g=arguments[d],null!==g)for(f=0;f<b.length;f++)if(h=b[f],h.name==g){a[g]=h.content;break}return a};DIL.modules={};
DIL.modules.siteCatalyst={init:function(a,b,d){try{var f={name:"DIL Site Catalyst Module Error"},e;if(!(b instanceof DIL))return e="dilInstance is not a valid instance of DIL",f.message=e,DIL.errorModule.handleError(f),e;f.partner=b.api.getPartner();if("object"!=typeof a)return e="siteCatalystReportingSuite is not an object",f.message=e,DIL.errorModule.handleError(f),e;if("function"!=typeof a.m_i||"function"!=typeof a.loadModule)return e="s.m_i is not a function or s.loadModule is not a function",
f.message=e,DIL.errorModule.handleError(f),e;var g=a.m_i("DIL");if("object"!=typeof g)return e="m is not an object",f.message=e,DIL.errorModule.handleError(f),e;g.trackVars=this.constructTrackVars(d);g.d=0;g._t=function(){var a,b,d=","+this.trackVars+",",g=this.s,h,k=[];h=[];var n={},s=!1;if("object"!=typeof g||!(g.va_t instanceof Array))return e="Error in m._t function: s is not an object or s.va_t is not an array",f.message=e,DIL.errorModule.handleError(f),e;if(this.d){if(g.lightProfileID)(a=g.lightTrackVars)&&
(a=","+a+","+g.vl_mr+",");else if(g.pe||g.linkType){a=g.linkTrackVars;if(g.pe&&(b=g.pe.substring(0,1).toUpperCase()+g.pe.substring(1),g[b]))a=g[b].trackVars;a&&(a=","+a+","+g.vl_l+","+g.vl_l2+",")}if(a){for(b=0,k=a.split(",");b<k.length;b++)0<=d.indexOf(","+k[b]+",")&&h.push(k[b]);h.length&&(d=","+h.join(",")+",")}for(h=0,b=g.va_t.length;h<b;h++)a=g.va_t[h],0<=d.indexOf(","+a+",")&&null!=g[a]&&""!==g[a]&&(n[a]=g[a],s=!0);s&&this.d.api.signals(n,"c_").submit()}};g.setup=function(){this.d=b};a.loadModule("DIL");
if("object"!=typeof a.DIL||"function"!=typeof a.DIL.setup)return e="s.DIL is not an object or s.DIL.setup is not a function",f.message=e,DIL.errorModule.handleError(f),e;a.DIL.setup()}catch(h){h.message="DIL Site Catalyst module caught error with message "+h.message;if(b instanceof DIL)h.partner=b.api.getPartner();DIL.errorModule.handleError(h);return h.message}},constructTrackVars:function(a){var b=[],d,f,e,g,h;if("object"==typeof a){d=a.names;if(d instanceof Array&&(e=d.length))for(f=0;f<e;f++)g=
d[f],"string"==typeof g&&g.length&&b.push(g);a=a.iteratedNames;if(a instanceof Array&&(e=a.length))for(f=0;f<e;f++)if(d=a[f],"object"==typeof d&&(g=d.name,h=parseInt(d.maxIndex,10),"string"==typeof g&&g.length&&!isNaN(h)&&0<=h))for(d=0;d<=h;d++)b.push(g+d);if(b.length)return b.join(",")}return this.constructTrackVars({names:"pageName,channel,campaign,products,events,pe,pev1,pev2,pev3".split(","),iteratedNames:[{name:"prop",maxIndex:75},{name:"eVar",maxIndex:75}]})}};
DIL.modules.GA={dil:null,arr:null,tv:null,errorMessage:"",defaultTrackVars:["_setAccount","_setCustomVar","_addItem","_addTrans","_trackSocial"],defaultTrackVarsObj:null,signals:{},hasSignals:!1,init:function(a,b,d){try{this.tv=this.arr=this.dil=null;this.errorMessage="";this.signals={};this.hasSignals=!1;var f={name:"DIL GA Module Error"},e="";b instanceof DIL?(this.dil=b,f.partner=this.dil.api.getPartner()):(e="dilInstance is not a valid instance of DIL",f.message=e,DIL.errorModule.handleError(f));
!(a instanceof Array)||!a.length?(e="gaArray is not an array or is empty",f.message=e,DIL.errorModule.handleError(f)):this.arr=a;this.tv=this.constructTrackVars(d);this.errorMessage=e}catch(g){g.message="DIL GA module caught error with message "+g.message;if(b instanceof DIL)g.partner=b.api.getPartner();DIL.errorModule.handleError(g);this.errorMessage=g.message}finally{return this}},constructTrackVars:function(a){var b=[],d,f,e,g;if(this.defaultTrackVarsObj!==Object(this.defaultTrackVarsObj)){e=this.defaultTrackVars;
g={};for(d=0,f=e.length;d<f;d++)g[e[d]]=!0;this.defaultTrackVarsObj=g}else g=this.defaultTrackVarsObj;if(a===Object(a)){a=a.names;if(a instanceof Array&&(f=a.length))for(d=0;d<f;d++)e=a[d],"string"==typeof e&&e.length&&e in g&&b.push(e);if(b.length)return b}return this.defaultTrackVars},constructGAObj:function(a){var b={},a=a instanceof Array?a:this.arr,d,f,e,g;for(d=0,f=a.length;d<f;d++)e=a[d],e instanceof Array&&e.length&&(g=e.shift(),"string"==typeof g&&g.length&&(b[g]instanceof Array||(b[g]=[]),
b[g].push(e)));return b},addToSignals:function(a,b){if("string"!=typeof a||""===a||null==b||""===b)return!1;this.signals[a]instanceof Array||(this.signals[a]=[]);this.signals[a].push(b);return this.hasSignals=!0},constructSignals:function(){var a=this.constructGAObj(),b={_setAccount:function(a){this.addToSignals("c_accountId",a)},_setCustomVar:function(a,b,d){"string"==typeof b&&b.length&&this.addToSignals("c_"+b,d)},_addItem:function(a,b,d,e,f,g){this.addToSignals("c_itemOrderId",a);this.addToSignals("c_itemSku",
b);this.addToSignals("c_itemName",d);this.addToSignals("c_itemCategory",e);this.addToSignals("c_itemPrice",f);this.addToSignals("c_itemQuantity",g)},_addTrans:function(a,b,d,e,f,g,h,m){this.addToSignals("c_transOrderId",a);this.addToSignals("c_transAffiliation",b);this.addToSignals("c_transTotal",d);this.addToSignals("c_transTax",e);this.addToSignals("c_transShipping",f);this.addToSignals("c_transCity",g);this.addToSignals("c_transState",h);this.addToSignals("c_transCountry",m)},_trackSocial:function(a,
b,d,e){this.addToSignals("c_socialNetwork",a);this.addToSignals("c_socialAction",b);this.addToSignals("c_socialTarget",d);this.addToSignals("c_socialPagePath",e)}},d=this.tv,f,e,g,h,m,o;for(f=0,e=d.length;f<e;f++)if(g=d[f],a.hasOwnProperty(g)&&b.hasOwnProperty(g)&&(o=a[g],o instanceof Array))for(h=0,m=o.length;h<m;h++)b[g].apply(this,o[h])},submit:function(){try{if(""!==this.errorMessage)return this.errorMessage;this.constructSignals();this.hasSignals&&this.dil.api.signals(this.signals).submit()}catch(a){a.message=
"DIL GA module caught error with message "+a.message;if(this.dil instanceof DIL)a.partner=this.dil.api.getPartner();DIL.errorModule.handleError(a);this.errorMessage=a.message}}};
//2.10
var audienceManager = function(){
	var _scObj = s_gi(s_account);
	var telDil = DIL.create({
		partner : "telstra",
		uuidCookie:{name:'aam_uuid',days:30}
	});
	DIL.modules.siteCatalyst.init(_scObj, telDil, {
	        names: ['pageName', 'channel', 'campaign', 'products', 'events', 'pe', 'referrer', 'server', 'purchaseID', 'zip', 'state'],
		iteratedNames: [{name: 'eVar', maxIndex: 75 },
		{name: 'prop', maxIndex: 75 },
		{name: 'pev', maxIndex: 3 },
		{name: 'hier', maxIndex: 4 }]
	});
	if(typeof s.eVar45 != 'undefined' && s.eVar45 && s.eVar44 != "not logged in"){
		telDil.api.aamIdSync({
			dpid: '559', //must be a string
			dpuuid: s.eVar45, //must be a string
			minutesToLive: 20160 //optional
		});
	};
};
/* END: AudienceManager code */
