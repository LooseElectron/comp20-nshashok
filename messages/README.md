Lab 6 README

--------------STUDENTS--------------
Nikolas Shashok       [nshash01]

-----------ACKNOWLEDGEMENTS--------------

-----------IMPLEMENTATION--------------
The parse() program successfuly retrieves raw JSON data from a local
source, parses it into usable objects, and updates index.html with
the content.

------------QUESTION--------------
It is not possible to request JSON data from a different origin
because of the "same-origin policy," which states that a Javascript
script cannot access files from a different origin than itself. This
is a neccessary security precaution to prevent the malicious use of
Javascript to write to, modify or delete a user's files, or to
deposit malware. Two documents have the same origin if the protocol
being used to host the documents and the hosts themselves are the same;
for example, since lab.js and data.json are both being hosted by
the local user, lab.js can pull data from data.json. However, since
messages.json is being hosted by messagehub.herokuapp.com, lab.js
cannot use an XMLHttpRequest to retrieve its data.


--------------TIME SPENT--------------
Approximately 1.5 hours were spent on this lab.