# koa2-login-demo
A demo of `sign up`, `sign in` and `reset password` which based on `koa v2`.

[Live Demo](https://koa2.xiejie.co)

## Remind
This project needs Node.js *v7.6.0(or later versions)*, MongoDB and Redis. Make sure you have installed these software on your device.

## Configure
The configuration file is `.env`  
Edit it with your own data:

1. Your email server, like gmail, outlook, etc.
2. Your email address
3. The password that your email provided for third parties

## Start
First of all, you should install the dependencies in `package.json`. You can use either with `npm` or `yarn`.

After the installation is complete, run the command below to build and start the demo
```bash
npm run build && npm start
```
You will see the output below after a few seconds, that means the demo started successfully.
```bash
Listening on 3030
```
Open `http://localhost:3030` in your browser.


## License
[MIT](LICENSE). Copyright (c) 2017 ConanXie.
