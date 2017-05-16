# koa2-login-example
A demo of registration, login, reset password which bases on `koa v2`.

[Live Demo](https://koa2.xiejie.co)

## Remind
This project needs Node.js *v7.6.0(or later versions)*, MongoDB and Redis. Make sure you have installed those software on your device.

## Configure
The configuration file is `config/index.js`.  
Change the `email` object with your own email data:

1. Your email server, like gmail, outlook, qq, etc.
2. Your email address
3. The password that your email provided for third parties

## Start
```
$ yarn install
```
If you haven't installed `yarn`, run the following command
```
$ npm i yarn -g
```

After installed the packages, run the command below to start the demo
```
$ npm start
```
If you want launch it with `pm2`, run the command like that
```
$ pm2 start index.js
```
You will see the output below after a few seconds, that means the demo started successfully.
```
Listening on 3030
```
Open `http://localhost:3030` in your browser.


## License
[MIT](LICENSE). Copyright (c) 2017 ConanXie.