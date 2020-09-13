# js13kgames.com Game Server

Game server for the [js13kGames Competition](http://js13kgames.com/).

## Install

[Download](https://github.com/js13kgames/js13kserver/archive/master.zip) the skeleton. Extract the files and install the third party libraries with `npm`.

    npm install

## Running

You can run the server locally with the following command:

    npm run start:dev

You can reach the test server at [http://localhost:3000](http://localhost:3000)

The dev server uses `nodemon` to auto restart when you change some source file. If you want to pass some parameter to it, just add an `--` after `start:dev`. An example:

    npm run start:dev -- --inspect

## Code structure

All your code must be in the `public` folder. Put your server side code into the `server.js` file. The `shared.js` file is loaded at the begining of the `server.js` file. You can also use this code on the client side.

The `server.js` is a standard Node.js module. You can use the following structure to create new [Express](https://expressjs.com/) routes or [Socket.io](https://socket.io/) connection handler.

    module.exports = {
        // Express route to /hello
        hello => (req, res) { ... }
        // Socket.io connection event handler
        io => (socket) { ... }
    }

## Persistent storage

The server category entries can use 13kByte persistent storage. The key and value size also counts into the limit!

The storage uses SQL database to save the key/value pairs. By default it's SQLite but on Heroku you have to use the Postgres add-on!

In the `server.js` file you can access the `storage` interface. The API documentation is inside the [lib](./lib/) folder.

## Deploy to Heroku

All server category entries must be hosted on [Heroku](https://www.heroku.com/). You can either use free or paid plan.

1. Push your files to your GitHub repository
2. Create new WebApp on heroku
3. Add Heroku Postgres add-on (optional)
4. Connect your WebApp with the GitHub repository
5. Deploy your code

You can find more information about the platform on the [Heroku Dev Center](https://devcenter.heroku.com/) site.

## Submit your entry

1. Zip all files in the `public` folder.
2. Submit your entry on the [js13kgames.com](http://js13kgames.com) site.
3. Add [contact@js13kgames.com](mailto:contact@js13kgames.com) games as collaborator to your Heroku WebApp.

## Server category rules

* Sandbox server
  - You can find the official sandbox server at [https://github.com/js13kGames/js13kserver](https://github.com/js13kGames/js13kserver).

* Package size still below 13 kB
  - Game package will contain all the game code and assets, for the client and the server.
  - That also means you must not use the server database to store extra code or assets, that was not created by its users. If your game needs to seed the DB, your 13k code must do it.

* Sandboxed environment
  - Your game will run in a node.js based sandbox environment. That means you will not really use node. You cannot require modules and your own modules shipped by your 13k pack.

* Do not leak the sandbox
  - This is not a hacking competition. This is a way to help the competition admins, the site persistence, and you. Do not touch the `procfile` and the skeleton code.

* Socket.io client lib
  - You can use it. Simply add `<script src="/socket.io/socket.io.js"></script>` to your HTML and that will be loaded. No server configuration will be needed. The sandbox already did it.

* Google's free STUN servers are the only allowed external services:
  * stun.l.google.com:19302
  * stun1.l.google.com:19302
  * stun2.l.google.com:19302
  * stun3.l.google.com:19302
  * stun4.l.google.com:19302


* Can I test the sandbox before submitting?
  - Yes, you can and you must! Installing and getting it running is simple. Visit the project page at [https://github.com/js13kGames/js13kserver](https://github.com/js13kGames/js13kserver).

* Is there any example? How do I develop my game using the sandbox server?
  - There's a simple "Rock, Paper, Scissors" example in the public folder.

* I have more questions!
  - Feel free to send them to [server@js13kgames.com](mailto:server@js13kgames.com).

## FAQ

* Can I minify the server side code?
  - Yes, but you have to keep the readable code also.

* Can I add more npm packages?
  - Yes, but you cannot use them in your game code.

* What files count in the 13kb limit?
  - All files in the `public` folder.

* Can I deploy new code after I submited the entry?
  - Yes, but you have to resubmit your entry on the site also.

* Can I modify the `procfile` or the skeleton code?
  - No
