# koa2-login-example
A demo of `sign up`, `sign in`, `reset password` which based on `koa v2`.

[Live Demo](https://koa2.xiejie.co)

## Remind
This project needs Node.js *v7.6.0(or later versions)*, MongoDB and Redis. Make sure you have installed these software on your device.

## Configure
The configuration file is `config/index.js`.  
Change the `email` object with your own email data:

1. Your email server, like gmail, outlook, etc.
2. Your email address
3. The password that your email provided for third parties

## Start
First of all, you should install the packages in `package.json`. You can use either with `npm` or `yarn`.

After the installation is complete, run the command below to start the demo
```
$ npm start
```
You will see the output below after a few seconds, that means the demo started successfully.
```
Listening on 3030
```
Open `http://localhost:3030` in your browser.


## License
[MIT](LICENSE). Copyright (c) 2017 ConanXie.
