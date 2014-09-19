var settings = new Store("settings", {
    "system": 'https://ws-web-clipper.luceosolutions.com/rest/',
    "username": 'admin',
    "password": 'foo'
});

var reqHelper = {
        initializeListener : function(){
            chrome.extension.onMessage.addListener(function(request, sender) {
                if (request.action == "getSource") {
                    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                        var host = tabs[0];
                        //var scrubbedResult = reqHelper.scrubElements(request.source, host);
                        var username = settings.get('username');

                        reqHelper.postCandidate({
                            "resume": Base64.encode(request),
                            "url": host,
                            "system": settings.get('system'),
                            "username": username
                        });
                    });
                }
            });
        },
        setStatusMessage : function(message){
            jQuery('#statusLabel').text(message);
        },
        scrubElements : function(document, host){
            var elementDoc = jQuery(document);
            var location = reqHelper.getLocation(host);

            if(location.hostname.indexOf('linkedin') > 0) {
                return elementDoc.find(".profile-card,.profile-background").text();
            } else {
                return elementDoc.remove(".navbar,.footer,.header").text();
            }
        },
        postCandidate : function(payload){
            reqHelper.setStatusMessage(payload);

            var username = settings.get('username');
            var password = settings.get('password');

            jQuery.ajax({
                url: 'http://luceo-web-clipper-api.herokuapp.com/index.php/resume',
                type: 'POST',
                dataType: 'json',
                //crossDomain: true,
                data: JSON.stringify(payload),
                contentType: 'application/json',
                username: username,
                password: password,
                /*headers: {
                 "Authorization": "Basic " + btoa(username + ":" + password)
                 },*/
                success: function result(data) {
                    console.log(data);
                    reqHelper.setStatusMessage("Candidate posted successfully");
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR);
                    console.log(textStatus);
                    reqHelper.setStatusMessage("Error: " + textStatus);
                }
            });
        },
        getLocation : function(host) {
            var location = document.createElement("a");
            location.href = host;
            return location;
        }
};

//Origin: https://gist.github.com/ncerminara/11257943
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

document.addEventListener('DOMContentLoaded', function () {
    reqHelper.initializeListener();

    jQuery('#createCandidateButton').click(function(){
        chrome.tabs.executeScript(null, {
            file: "src/browser_action/getPageSource.js"
        }, function() {
            if (chrome.extension.lastError) {
                reqHelper.setStatusMessage('There was an error injecting script : \n' + chrome.extension.lastError.message)
            }
        });
    });
});