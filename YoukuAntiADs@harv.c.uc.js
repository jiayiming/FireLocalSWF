// ==UserScript==
// @name            youkuantiads.uc.js
// @namespace       YoukuAntiADs@harv.c
// @description     视频网站去黑屏
// @include         chrome://browser/content/browser.xul
// @author          harv.c
// @homepage        http://haoutil.tk
// @version         1.6.1
// @updateUrl       https://j.mozest.com/zh-CN/ucscript/script/92.meta.js
// @downloadUrl     https://j.mozest.com/zh-CN/ucscript/script/92.uc.js
// ==/UserScript==
(function() {
    // YoukuAntiADs, request observer
    function YoukuAntiADs() {};
    var refD = 'file:///' + Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).path + '/chrome/swf/';
    YoukuAntiADs.prototype = {
        SITES: {
 /*           'youkuloader': {
                'player0': refD + 'loader.swf',
                'player1': refD + 'oloader.swf',
                're': /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/loaders?\.swf/i
            },
            'youkuplayer': {
                'player0': refD + 'player.swf',
                'player1': refD + 'oplayer.swf',
                're': /http:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/q?player[^\.]*\.swf/i
            },
*/
            'youku_loader': {
                'player': refD + 'loader.swf',
                're': /http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/loaders?\.swf/i
            },
            'youku_player': {
                'player': refD + 'player.swf',
                're': /http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/q?player[^\.]*\.swf/i
            },
            'ku6': {
                'player': refD + 'ku6.swf',
                're': /http:\/\/player\.ku6cdn\.com\/default\/.*\/(v|player)\.swf/i
            },
            'ku6_out': {
                'player': refD + 'ku6_out.swf',
                're': /http:\/\/player\.ku6cdn\.com\/default\/out\/\d{12}\/player\.swf/i
            },
            'iqiyi': {
                'player0': refD + 'iqiyi_out.swf',
                'player1': refD + 'iqiyi5.swf',
                'player2': refD + 'iqiyi.swf',
                're': /https?:\/\/www\.iqiyi\.com\/(player\/\d+\/Player|common\/flashplayer\/\d+\/(Main|Coop|Share|Enjoy)?(Player_[^\.]+|[^\/]+c2359))\.swf/i
            },
            'iqiy_out': {
                'player': refD + 'iqiyi_out.swf',
                're': /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/SharePlayer_.*\.swf/i
            },
            'tudou': {
                'player': refD + 'tudou.swf',
                're': /http:\/\/js\.tudouui\.com\/.*portalplayer[^\.]*\.swf/i
            },
            'tudou_olc': {
                'player': refD + 'olc_8.swf',
                're': /http:\/\/js\.tudouui\.com\/.*olc[^\.]*\.swf/i
            },
            'tudou_sp': {
                'player': refD + 'sp.swf',
                're': /http:\/\/js\.tudouui\.com\/.*\/socialplayer[^\.]*\.swf/i
            },
            'letv': {
                'player': refD + 'letv.swf',
                're': /http:\/\/.*\.letv(cdn)?\.com\/.*(new)?player\/((SDK)?Letv|swf)Player\.swf/i
            },
            'letvpccs': {
                'player': 'http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml',
                're': /http:\/\/www\.le(tv)?\.com\/.*\/playerapi\/pccs_(?!(.*live|sdk)).*_?(\d+)\.xml/i
            },
            'letv_live': {
                'player': refD + 'letv.in.Live.swf',
                're': /http:\/\/.*letv.*\.com\/.*\/VLetvPlayer\.swf/i
            },
            'pptv': {
                'player': refD + 'pptv.swf',
                're': /http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i
            },
            'pptv_live': {
                'player': refD + 'pptv.in.Live.swf',
                're': /http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i
            },
            'sohu_live': {
                'player': refD + 'sohu_live.swf',
                're': /http:\/\/(tv\.sohu\.com\/upload\/swf\/(p2p\/)?\d+|(\d+\.){3}\d+\/wp8player)\/Main\.swf/i
            },
            'pps': {
                'player': refD + 'iqiyi.swf',
                're': /https?:\/\/www\.iqiyi\.com\/common\/.*\/pps[\w]+.swf/i
            }
        },
        REFRULES: {
            'iqiyi': {
                're': 'http://www.iqiyi.com/',
                'find': /.*\.qiyi\.com/i
            },
            'youku': {
                're': 'http://www.youku.com/',
                'find': /http:\/\/.*\.youku\.com/i
            }
        },
        os: Cc['@mozilla.org/observer-service;1']
                .getService(Ci.nsIObserverService),
		ios: Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService),
        init: function() {
            var site = this.SITES['iqiyi'];
            site['preHandle'] = function(aSubject) {
                var wnd = this.getWindowForRequest(aSubject);
                if(wnd) {
                    site['cond'] = [
                        !/(^((?!baidu|61|178).)*\.iqiyi\.com|pps\.tv)/i.test(wnd.self.location.host),
                        wnd.self.document.querySelector('span[data-flashplayerparam-flashurl]'),
                        true
                    ];
                    if(!site['cond']) return;
                    
                    for(var i = 0; i < site['cond'].length; i++) {
                        if(site['cond'][i]) {
                            if(site['player'] != site['player' + i]) {
                                site['player'] = site['player' + i];
                                site['storageStream'] = site['storageStream' + i] ? site['storageStream' + i] : null;
                                site['count'] = site['count' + i] ? site['count' + i] : null;
                            }
                            break;
                        }
                    }
                }
            };
            site['callback'] = function() {
                if(!site['cond']) return;

                for(var i = 0; i < site['cond'].length; i++) {
                    if(site['player' + i] == site['player']) {
                        site[' ' + i] = site['storageStream'];
                        site['count' + i] = site['count'];
                        break;
                    }
                }
            };
//add
/*
            var site1 = this.SITES['youkuloader'];
            site1['preHandle'] = function(aSubject) {
                var wnd = this.getWindowForRequest(aSubject);
                if(wnd) {
                    //ADD
                    site1['cond'] = [
                        !this.flagDeterminer(wnd),
                        true
                    ];
                    //console.log(site1);
                    if(!site1['cond']) return;
                    
                    for(var i = 0; i < site1['cond'].length; i++) {
                        if(site1['cond'][i]) {
                            if(site1['player'] != site1['player' + i]) {
                                site1['player'] = site1['player' + i];
                                site1['storageStream'] = site1['storageStream' + i] ? site1['storageStream' + i] : null;
                                site1['count'] = site1['count' + i] ? site1['count' + i] : null;
                            }
                            break;
                        }
                    }
                }
            };
            site1['callback'] = function() {
                if(!site1['cond']) return;

                for(var i = 0; i < site1['cond'].length; i++) {
                    if(site1['player' + i] == site1['player']) {
                        site1[' ' + i] = site1['storageStream'];
                        site1['count' + i] = site1['count'];
                        break;
                    }
                }
            };

            var site2 = this.SITES['youkuplayer'];
            site2['preHandle'] = function(aSubject) {
                var wnd = this.getWindowForRequest(aSubject);
                if(wnd) {
                    //ADD
                    site2['cond'] = [
                        !this.flagDeterminer(wnd),
                        true
                    ];
                    //console.log(site2);
                    if(!site2['cond']) return;
                    
                    for(var i = 0; i < site2['cond'].length; i++) {
                        if(site2['cond'][i]) {
                            if(site2['player'] != site2['player' + i]) {
                                site2['player'] = site2['player' + i];
                                site2['storageStream'] = site2['storageStream' + i] ? site2['storageStream' + i] : null;
                                site2['count'] = site2['count' + i] ? site2['count' + i] : null;
                            }
                            break;
                        }
                    }
                }
            };
            site2['callback'] = function() {
                if(!site2['cond']) return;

                for(var i = 0; i < site2['cond'].length; i++) {
                    if(site2['player' + i] == site2['player']) {
                        site2[' ' + i] = site2['storageStream'];
                        site2['count' + i] = site2['count'];
                        break;
                    }
                }
            };
*/
//
        },
        // getPlayer, get modified player
        getPlayer: function(site, callback) {
            NetUtil.asyncFetch(site['player'], function(inputStream, status) {
                var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1']
                                            .createInstance(Ci['nsIBinaryOutputStream']);
                var storageStream = Cc['@mozilla.org/storagestream;1']
                                        .createInstance(Ci['nsIStorageStream']);
                var count = inputStream.available();
                var data = NetUtil.readInputStreamToString(inputStream, count);

                storageStream.init(512, count, null);
                binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
                binaryOutputStream.writeBytes(data, count);

                site['storageStream'] = storageStream;
                site['count'] = count;

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

            if (aTopic == "http-on-modify-request") {
            //if (aTopic == "http-on-opening-request") {
//Headers Modifier
                var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
                for(var i in this.REFRULES) {
                    var rule = this.REFRULES[i];
                    try {
                        var URI = httpChannel.originalURI.spec;
                        if(rule['find'].test(URI)) {
                            if(rule['re'] != "")
                            {
                                httpChannel.referrer = this.ios.newURI(rule['re'], null, null);
                            }
                            httpChannel.setRequestHeader('Referer', rule['re'], false);
                        }
                    }
                    catch(e) {
                        alert(e);
                    }
                }
//Redirector
                for(var i in this.REDIRRULES) {
                    var rule = this.REDIRRULES[i];
                    try {
                        var oriURI = httpChannel.originalURI.spec;
                        var URI = httpChannel.URI.spec;
                        if(rule['find'].test(oriURI) && rule['find'].test(URI)) {  //prevent from loop
                            console.log(URI);
                            if(rule['re'] != "")
                            {
                                httpChannel.redirectTo(this.ios.newURI(oriURI.replace(rule['find'],rule['re']), null, null));
                            }
                        }
                    }
                    catch(e) {
                        alert(e);
                    }
                }
                return;
            }
//Content Replacer
            if(aTopic != 'http-on-examine-response') return;

            var http = aSubject.QueryInterface(Ci.nsIHttpChannel);
            for(var i in this.SITES) {
                var site = this.SITES[i];
                if(site['re'].test(http.URI.spec)) {
                    var fn = this, args = Array.prototype.slice.call(arguments);

                    if(typeof site['preHandle'] === 'function')
                        site['preHandle'].apply(fn, args);

                    if(!site['storageStream'] || !site['count']) {
                        http.suspend();
                        this.getPlayer(site, function() {
                            http.resume();
                            if(typeof site['callback'] === 'function')
                                site['callback'].apply(fn, args);
                        });
                    }

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
                return this;

            return Cr.NS_ERROR_NO_INTERFACE;
        },
 /*       flagDeterminer: function(wnd) { //flag for youku now
            var adjflag = false;
            var idObject = /id_(.*).html/i.exec(wnd.self.document.URL);
            if (idObject != null)
            {
                var vid = idObject[1];
                var xhr = new XMLHttpRequest();
                var infoUrl = "http://play.youku.com/play/get.json?vid="+ vid +"&ct=10&ran=" + parseInt(Math.random() * 9999);
                //console.log(infoUrl);
                xhr.open("GET", infoUrl, false);    //synchronous mode
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                            //console.log(xhr.responseText);
                            adjflag = /"transfer_mode":"rtmp"/i.test(xhr.responseText);
                    }
                }
                xhr.send();
            }
            return adjflag;
        },
*/
        register: function() {
            this.init();
            this.os.addObserver(this, 'http-on-examine-response', false);
            this.os.addObserver(this, 'http-on-modify-request', false);
            //this.os.addObserver(this, 'http-on-opening-request', false);
        },
        unregister: function() {
            this.os.removeObserver(this, 'http-on-examine-response', false);
            this.os.removeObserver(this, 'http-on-modify-request', false);
            //this.os.removeObserver(this, 'http-on-opening-request', false);
        }
    };

    function CCIN(cName, ifaceName) {
        return Cc[cName].createInstance(Ci[ifaceName]);
    }

    // TrackingListener, redirect youku player to modified player
    function TrackingListener() {
        this.originalListener = null;
        this.site = null;
        this.aSubject = null;
        this.originalData = null;
    }
    TrackingListener.prototype = {
        onStartRequest: function(request, context) {
            this.originalListener.onStartRequest(request, context);
        },
        onStopRequest: function(request, context) {
            this.originalListener.onStopRequest(request, context, Cr.NS_OK);
        },
//Modify in-fight
        onDataAvailable: function(request, context, inputStream, offset, count) {
            this.originalListener.onDataAvailable(request, context, this.site['storageStream'].newInputStream(0), 0, this.site['count']);//Replace the original chain to change the dest-File
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
