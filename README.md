# Flex Server [![CircleCI](https://circleci.com/gh/ayshiff/flex-server/tree/master.svg?style=svg)](https://circleci.com/gh/ayshiff/flex-server/tree/master)

The project implements JSON API to manage places of users in a building. You can run the server using a dockerfile.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You have to install nodeJs from the [official website](https://nodejs.org/en/download/)

You can check that everything is ok by typing: `nodejs -v` and `npm -v`

### Configure

To use the server you will have to configure the database you use.

In case of local deployment :

Install MongoDB

Create 'flex' database

Check the mongo configuration file :

Use 'local' mode for local deployment or 'remote' for cloud deployment.
```
module.exports = {
  'host': 'host.docker.internal', // Must use this specific hostname for mac users only
  'port':'27017',
  'username': '',
  'password': '',
  'db':'flex',
  'mode':'local' // 'local' || 'remote'
};
```

An other and easy way is to use [mlab](https://docs.mlab.com/).

You have to pass variables as environment variables or on the `/config/mlab` file.

### Installing

There is two ways to install the server:

#### 1. Using npm

```
npm install
```

#### 2. Using Docker

```
docker build -t <your username>/flex-server .
```
### Run

#### 1. Using npm

```
npm start
```

#### 2. Using Docker

```
docker run -p 3000:3000 -it <your username>/flex-server
```

### Create an API token for use

Now you can access the API using localhost.
Open your browser and type url `localhost:3000/ping`.
If you got the message "pong", everything goes well.

By typing the following command on your terminal or sending same informations on Postman or similar tool you will get an API token that can be used to access to other services of the API.

```
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST -d "name=<User name>&email=<User mail>&password=<User password>" http://localhost:3000/api/register
```

Once registered you can type this to get the API token again.

```
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST -d "email=<User mail>&password=<User password>" http://localhost:3000/api/login
```

You have to send the API token on the headers as `x-access-token` to access API content.

## Configure https

You have to create a self-signed certificate with openSSL :

```openssl req -nodes -new -x509 -keyout server.key -out server.cert```

And put the `cert.pem` and `key.pem` under a folder `cert` in `./app` 

Then enable https in Express by adding this lines in app/server.ts:

``` js 
const httpsOptions = {
    key:   fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
    cert:   fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
};
```

You can then add those lines in the `server.ts` file: 

``` js
https.createServer(httpsOptions, app).listen(process.env.PORT || DEFAULT_PORT, function() {
    console.log('Express HTTPS server listening on port ' + DEFAULT_PORT);
});
```

## Run tests

You can run the tests under the `app/test` folder by running the command `npm run test`


## Crypto operations

Crypto logic is currently written in `js` but we want to implement this logic using `golang` which will lead to performance gains. You can find the crypto-golang module under the `crypto-go` folder.
The go code is then compiled to C++ and imported into node JS app.

## Use the API


## Deployment

TODO

## Built With

TODO

## Contributing

TODO


## Versioning
Semantic Versioning Specification (SemVer)

## Authors


## License


## Acknowledgments


