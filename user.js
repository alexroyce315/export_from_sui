// ==UserScript==
// @name         捕获随手记账单数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sui.com/account/account.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                if ( xhr.responseURL.includes('https://www.sui.com/account/account.rmi') ) {
                    var response = JSON.parse(xhr.response);
                    var groups = response.groups;
                    var lists = [];
                    // 每天的
                    for ( var i = 0;i < groups.length; i++ ) {
                        // 每条
                        var list = groups[i].list;
                        for ( var j = 0;j < list.length; j++ ) {
                            var item = list[j];
                            item = {'category':item.categoryName, 'acount':item.buyerAcount, 'amount':item.itemAmount, 'addtime':item.date.time};
                            lists.push(item);
                        }
                    }
                    sendForm(JSON.stringify(lists));
                    //do something!
                    setTimeout(function () {
                        document.getElementById('page-r').click();
                    }, 5000);
                }
            }
        });
    });

    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }

    function sendForm(data) {
        // Create the iFrame used to send our data
        var iframe = document.createElement('frame');
        iframe.url = 'http://localhost';

        // Next, attach the iFrame to the main document
        window.addEventListener("load", function () {
            iframe.style.display = "none";
            document.body.appendChild(iframe);
        });

        sendData(data)
    }

    function sendData(data) {
        var xmlhttp = new XMLHttpRequest();
        var url = 'http://localhost/sui.php';
        xmlhttp.open('POST', url);
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //xmlhttp.send(JSON.stringify(data));
        xmlhttp.send(data);
    }

})();
