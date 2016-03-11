// Your JavaScript goes here...
function parse() {
        request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                        var raw = request.responseText;
                        var messages = JSON.parse(raw);
                        console.log(messages);

                        var elem = document.getElementById("messages");

                        var length = messages.length;
                        for (i = 0; i < length; i++) {
                                var content = messages[i].content;
                                var username = messages[i].username;
                                elem.innerHTML += "<p class='msg'>" + content +
                                                  " <span class='usr'>" +
                                                  username + "</span></p>";
                        }
                }
        }

        request.open("GET", "https://messagehub.herokuapp.com/messages.json", true);

        request.send(null);
}