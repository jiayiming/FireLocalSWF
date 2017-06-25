// ==UserScript==
// @name				youkuantiads.uc.js
// @namespace		YoukuAntiADs@harv.c
// @description		视频网站去黑屏
// @include				chrome://browser/content/browser.xul
// @author				harv.c & 15536900
// @homepage		https://github.com/kafan15536900/
// @version				2.0.0.5
// @updateURL	 
// ==/UserScript==
(function() {
	// YoukuAntiADs, request observer
	function YoukuAntiADs() {};
	var swfNode = Services.dirsvc.get('UChrm', Ci.nsILocalFile); swfNode.appendRelativePath("swf");
	YoukuAntiADs.prototype = {
		SITES: {
/*			'youku_loader': {
				'target': 'loader.swf',
				'find': /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/.*\/loaders?\.swf/i
			},*/
			'youku_player': {
				'target': 'player.swf',
				'find': /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/(.*\/)?q?player.*\.swf/i
			},
			'tudou': {
				'target': 'tudou.swf',
				'find': /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/custom\/.*\/q?player.*\.swf/i
			},
			'iqiyi': {
				'target': 'iqiyi5.swf',
				'find': /https?:\/\/www\.iqiyi\.com\/(player\/\d+\/Player|common\/flashplayer\/\d+\/((Main)?Player_.*|[\d]{4}[a-z]+((?!aa|dc32).){6,7}))\.swf/i
			},
			'iqiy_out': {
				'target': 'iqiyi_out.swf',
				'find': /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/SharePlayer_.*\.swf/i
			},
			'letvsdk': {
				'target': 'letvsdk.swf',
				'find': /http:\/\/player\.letvcdn\.com\/.*\/newplayer\/LetvPlayerSDK\.swf/i
			},
			'sohu_live': {
				'target': 'sohu_live.swf',
				'find': /https?:\/\/(tv\.sohu\.com\/upload\/swf\/(p2p\/)?\d+|(\d+\.){3}\d+\/wp8player)\/Main\.swf/i
			},
			'pptv': {
				'target': 'pptv.swf',
				'find': /http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i
			}
/*			'ku6': {
				'target': 'ku6.swf',
				'find': /http:\/\/player\.ku6cdn\.com\/default\/.*\/(v|player)\.swf/i
			},
			'ku6_out': {
				'target': 'ku6_out.swf',
				'find': /http:\/\/player\.ku6cdn\.com\/default\/out\/\d{12}\/player\.swf/i
			}*/
/*			'example3': {
				'method':'INLINE',
				're': [
								'playArea .player{height:auto}',
								'.vpactionv5_iframe_wrap{top:auto$1}.'
							],
				'match':[
								/\.playArea \.player{height:\d+px}/i,
								/ \.vpactionv5_iframe_wrap{top:\d+px(.*)}\./i
							],
				'find': /http:\/\/donotexist.com\/test.css/i
			}*/
		},
		REFRULES: {
			'youku': {
				'target': 'http://www.youku.com/',
				'find': /http:\/\/.*\.youku\.com/i
			},
			'iqiyi': {
				'target': 'http://www.iqiyi.com/',
				'find': /.*\.qiyi\.com/i
			},
			'tucao': {
				'target': 'http://www.tudou.com/',
				'find': /vr\.tudou\.com/i
			}
		},
		REDIRRULES: {
/*			'redirexample1': {
				'target': 'http://anothersite.com/player.swf',
				'find': /http:\/\/donotexist.com\/test.swf/i
			}*/
		},
		os: Cc['@mozilla.org/observer-service;1']
				.getService(Ci.nsIObserverService),
		ios: Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService),
		init: function() {
			return;
		},
		// getContent, get modified stream
		getContent: function(site, callback) {
			console.log(site['target']);
			//ADD using nsILocalFile API to remove warning from NetUtil.asyncFetch
			var pSource = site['target'];
			try{
				if(!/(profiles|https?:)/i.test(pSource))	//skip when match local_file(in profiles dir) or HTTP(S) uri 
				{
					pSource = swfNode.clone();
					pSource.appendRelativePath(site['target']);
				}
			}catch(e) {}
			//
			NetUtil.asyncFetch(pSource, function(inputStream, status) {
				var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1']
											.createInstance(Ci['nsIBinaryOutputStream']);
				var storageStream = Cc['@mozilla.org/storagestream;1']
										.createInstance(Ci['nsIStorageStream']);
				if (!Components.isSuccessCode(status)) {
					// Handle error
					console.log('Fetch Failed');
				}
				else
				{
					var count = inputStream.available();
					var data = NetUtil.readInputStreamToString(inputStream, count);

					storageStream.init(512, count, null);
					binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
					binaryOutputStream.writeBytes(data, count);

					site['storageStream'] = storageStream;
					site['count'] = count;
				}
				if(typeof callback === 'function') {
					callback();
				}
			});
		},
		getWindowForRequest: function(request){
			if(request instanceof Ci.nsIRequest){
				try{
					if(request.notificationCallbacks){
						return request.notificationCallbacks
									.getInterface(Ci.nsILoadContext)
									.associatedWindow;
					}
				} catch(e) {}
				try{
					if(request.loadGroup && request.loadGroup.notificationCallbacks){
						return request.loadGroup.notificationCallbacks
									.getInterface(Ci.nsILoadContext)
									.associatedWindow;
					}
				} catch(e) {}
			}
			return null;
		},
		observe: function(aSubject, aTopic, aData) {
//Observer Funtions
			if (aTopic == "http-on-modify-request") {
//Headers Modifier
				var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
				for(var i in this.REFRULES) {
					var rule = this.REFRULES[i];
					try {
						var URI = httpChannel.originalURI.spec;
						if(rule['find'].test(URI)) {
							console.log("Headers Modifier");
							//console.log(URI);
							if(rule['target'] != "")
							{
								httpChannel.referrer = this.ios.newURI(rule['target'], null, null);
							}
							httpChannel.setRequestHeader('Referer', rule['target'], false);
							break;
						}
					}
					catch(e) {
						alert(e);
						break;
					}
				}
//URL Redirector
				for(var i in this.REDIRRULES) {
					var rule = this.REDIRRULES[i];
					try {
						var oriURI = httpChannel.originalURI.spec;
						var URI = httpChannel.URI.spec;
						if(rule['find'].test(oriURI) && rule['find'].test(URI)) {	//prevent from loop
							console.log("URL Redirector");
							console.log(URI);
							if(rule['target'] != "")
							{
								httpChannel.redirectTo(this.ios.newURI(oriURI.replace(rule['find'],rule['target']), null, null));
							}
							break;
						}
					}
					catch(e) {
						alert(e);
						break;
					}
				}
				return;
			}
//Content Replacer
			if(aTopic != 'http-on-examine-response') return;

			var http = aSubject.QueryInterface(Ci.nsIHttpChannel);
			for(var i in this.SITES) {
				var site = this.SITES[i];
				if(site['find'].test(http.URI.spec)) {
					if(!site['storageStream'] || !site['count']) {
						http.suspend();
						console.log("Content Replacer");
						switch(site['method'])
						{
							case 'INLINE':
								http.resume();
							break;

							case 'BLOCK':
								console.log("Blocking..");
								aSubject.cancel(Cr.NS_BINDING_ABORTED);	//aSubject.cancel(Components.results.NS_BINDING_ABORTED);
								http.resume();
								break
							break;

							default:
								this.getContent(site, function() {
									console.log("Getting Files..");
									http.resume();
								});
							break;
						}
					}
					//TrackingListener Chain
					var newListener = new TrackingListener();
					aSubject.QueryInterface(Ci.nsITraceableChannel);
					newListener.originalListener = aSubject.setNewListener(newListener);
					newListener.site = site;
					newListener.aSubject = aSubject;
					break;
				}
			}
		},
		QueryInterface: function(aIID) {
			if(aIID.equals(Ci.nsISupports) || aIID.equals(Ci.nsIObserver))
			{
				return this;
			}
			else
			{
				return Cr.NS_ERROR_NO_INTERFACE;
			}
		},
		register: function() {
			this.init();
			this.os.addObserver(this, 'http-on-examine-response', false);
			this.os.addObserver(this, 'http-on-modify-request', false);
		},
		unregister: function() {
			this.os.removeObserver(this, 'http-on-examine-response', false);
			this.os.removeObserver(this, 'http-on-modify-request', false);
		}
	};

	function CCIN(cName, ifaceName) {
		return Cc[cName].createInstance(Ci[ifaceName]);
	}

	// TrackingListener, redirect original content to modified one
	function TrackingListener() {
		//Init state
		this.originalListener = null;
		this.site = null;
		this.aSubject = null;
		this.originalData = null;
	}
	TrackingListener.prototype = {
		onStartRequest: function(request, context) {
			//console.log('onStartRequest');
			this.originalListener.onStartRequest(request, context);
		},
		onStopRequest: function(request, context) {
			//console.log('onStopRequest');
			this.originalListener.onStopRequest(request, context, Cr.NS_OK);
		},
		onDataAvailable: function(request, context, inputStream, offset, count) {
			//Modify Content in-flight
			//Inline Modifier
			//When respone code is not 200,Flash won't accept the content...nothing i can do to bypass it except to rewrite firefox's src

			var chttp = this.aSubject.QueryInterface(Ci.nsIHttpChannel);
			console.log(chttp.URI.spec);
			var csite = null;
			for(var i in YoukuAntiADs.prototype.SITES)
			{
				var site = YoukuAntiADs.prototype.SITES[i];
				if(site['find'].test(chttp.URI.spec))
				{
					//When offset is not equal 0, it means this request is partial-load.
					//The site['storageStream'] and site['count'] may have already defined at sometimes before.
					//So here we have to ignore the existance of site['storageStream'] or site['count']
					//just replace the content, calcuate count, pass the correct value to the original chian.
					switch(site['method'])
					{
						case 'INLINE':
							console.log("Inline Modifier");
							console.log(chttp.URI.spec);
							if (site['match'].length == site['re'].length)
							{
								chttp.suspend();
								console.log("Working..");
								var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1']
										.createInstance(Ci['nsIBinaryOutputStream']);
								var storageStream = Cc['@mozilla.org/storagestream;1']
										.createInstance(Ci['nsIStorageStream']);

								var count = inputStream.available();
								var data = NetUtil.readInputStreamToString(inputStream, count);

								
								console.log("beforelength:"+count);
								//console.log("beforedata:"+data);

								for(var u in site['match']) {
									var match = site['match'][u];
									var re = site['re'][u];
									data = data.replace(match,re);

								}
								count = data.length;
								//==
								console.log("afterlength:"+count);
								//console.log("afterdata:"+ data);

								storageStream.init(512, count, null);
								binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
								binaryOutputStream.writeBytes(data, count);

								site['storageStream'] = storageStream;
								site['count'] = count;
								
								csite = site;
								chttp.resume();
								console.log("Complete..");
							}
							else
							{
								console.log("Error..");;
							}
						break;

						default:
						break;
					}
					break;
				}
			}
			//Replace the Original-Stream to the Changed-Stream
			if(csite)
			{
				//fix a historical bug when dealing with a request which offset > 0
				this.originalListener.onDataAvailable(request, context, csite['storageStream'].newInputStream(0), offset, csite['count']);
			}
			else
			{
				if(this.site['storageStream'] || this.site['count'])
				{
					//When partial-load and if the count and offset is not equal to the original one
					//'http channel Listener OnDataAvailable contract violation' warning will be fired, but that's all right nsHttpChannel will fix it.
					this.originalListener.onDataAvailable(request, context, this.site['storageStream'].newInputStream(0), 0, this.site['count']);
				}
				else
				{
					//Ignore
					this.originalListener.onDataAvailable(request, context, inputStream, offset, count);
				}
			}
		}
	};

	// register observer
	var y = new YoukuAntiADs();
	if(location == 'chrome://browser/content/browser.xul') {
		y.register();
	}

	// unregister observer
	window.addEventListener('unload', function() {
		if(location == 'chrome://browser/content/browser.xul') {
			y.unregister();
		}
	});
})();