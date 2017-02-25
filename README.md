# koa2-login-example
A demo of registration, login, retrieve password which uses koa v2.

[Live Demo](https://koa2.xiejie.co)

## Remind
This project needs Node.js v7.0.0(or later versions), MongoDB and Redis. Make sure you have installed the software on your device.

## Configure
The configuration file is `config/index.js`.
Change the `email` object with your email data:

1. your email server, like gmail, outlook, qq e.g.
2. your email address
3. the password your email provided for third parties

## Start
```
$ yarn install
```
If you haven't installed `yarn`, run the following command
```
$ npm i yarn@latest -g
```

When those packages in `package.json` have installed, run this command to start the demo
```
$ npm start
```
If you want launch it with `pm2`, run the command like that:
```
$ pm2 start index.js --node-args="--harmony-async-await" --watch
```
You can see this output after a few seconds, that means the demo started successfully.
```
Listening on 3030
```
Open `http://localhost:3030` in your browser.


## License
[MIT](LICENSE). Copyright (c) 2017 ConanXie.