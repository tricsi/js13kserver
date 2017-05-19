"use strict";

(function () {

    var incoming, //SimplePeer incoming client
        outgoing, //SimplePeer outgoing client
        socket, //Socket.IO client
        chat, //Video chat checkbox
        video, //Video element
        stream, //Video stream
        buttons, //Button elements
        message, //Message element
        score, //Score element
        points = { //Game points
            draw: 0,
            win: 0,
            lose: 0
        };

    /**
     * Disable all button
     */
    function disableButtons() {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("disabled", "disabled");
        }
    }

    /**
     * Enable all button
     */
    function enableButtons() {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].removeAttribute("disabled");
        }
    }

    /**
     * Set message text
     * @param {string} text
     */
    function setMessage(text) {
        message.innerHTML = text;
    }

    /**
     * Set score text
     * @param {string} text
     */
    function displayScore(text) {
        score.innerHTML = [
            "<h2>" + text + "</h2>",
            "Won: " + points.win,
            "Lost: " + points.lose,
            "Draw: " + points.draw
        ].join("<br>");
    }

    /**
     * Create peer connection
     * @param {boolean} initiator
     */
    function createPeer(initiator, stream) {
        var peer = new SimplePeer({
            initiator: initiator,
            stream: stream
        });

        peer.on('error', function (err) {
            console.log("Error: " + err);
        });

        peer.on('signal', function (data) {
            //socket.emit("signal", data);
            incoming = createPeer(false);
            incoming.signal(data);
            console.log(JSON.stringify(data));
        });

        peer.on('connect', function () {
            peer.send('whatever' + Math.random());
        });

        peer.on('data', function (data) {
            console.log('Data: ' + data);
        });

        peer.on('stream', function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            console.log(video.src);
        });

        return peer;
    }

    /**
     * Binde Socket.IO and button events
     */
    function bind() {

        socket.on("signal", function (data) {
            incoming = createPeer(false);
            incoming.signal(data);
        });

        socket.on("start", function (initiator) {
            enableButtons();
            setMessage("Round " + (points.win + points.lose + points.draw + 1));
        });

        socket.on("win", function () {
            points.win++;
            displayScore("You win!");
        });

        socket.on("lose", function () {
            points.lose++;
            displayScore("You lose!");
        });

        socket.on("draw", function () {
            points.draw++;
            displayScore("Draw!");
        });

        socket.on("end", function () {
            disableButtons();
            setMessage("Waiting for opponent...");
        });

        socket.on("connect", function () {
            disableButtons();
            setMessage("Waiting for opponent...");
        });

        socket.on("disconnect", function () {
            disableButtons();
            setMessage("Connection lost!");
        });

        socket.on("error", function () {
            disableButtons();
            setMessage("Connection error!");
        });

        chat.addEventListener("change", function (e) {
            if (chat.checked) {
                navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240 },
                    audio: true
                }).then(function(stream) {
                    outgoing = createPeer(true, stream);
                }).catch(function(err) {
                    chat.checked = false;
                });
            } else if (outgoing) {
                outgoing.stream.getVideoTracks().forEach(function(track) {
                    track.stop();
                });
                outgoing.stream.getAudioTracks().forEach(function(track) {
                    track.stop();
                });
                outgoing.destroy();
            }
        }, false);

        for (var i = 0; i < buttons.length; i++) {
            (function (button, guess) {
                button.addEventListener("click", function (e) {
                    disableButtons();
                    socket.emit("guess", guess);
                }, false);
            })(buttons[i], i + 1);
        }
    }

    /**
     * Client module init
     */
    function init() {
        socket = io({ upgrade: false, transports: ["websocket"] });
        chat = document.getElementById("chat");
        video = document.getElementById("video");
        buttons = document.getElementsByTagName("button");
        message = document.getElementById("message");
        score = document.getElementById("score");
        disableButtons();
        if (SimplePeer.WEBRTC_SUPPORT) {
            chat.removeAttribute("disabled"); 
        }
        bind();
    }

    window.addEventListener("load", init, false);

})();
