# Flex Server [![CircleCI](https://circleci.com/gh/BREDFactory/flex-server.svg?style=svg)](https://circleci.com/gh/BREDFactory/flex-server)


The project implements JSON API to manage places of users in a building. You can run the server using a dockerfile.

## **Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### **Prerequisites**

You have to install nodeJs from the [official website](https://nodejs.org/en/download/)

You can check that everything is ok by typing: `nodejs -v` and `npm -v`

## **Docker** 🐳

You have to install docker from the [official website](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/#install-compose)(If you are on Mac, Docker installation already includes docker-compose).

And then you can run :
```
docker-compose build
```
Which will buid the containers and then :
```
docker-compose run
```
Which will run the containers.

By default app will launch on port **3000** and mongoDB on port **27017**

You can list all your running containers by typing the command: 
``` docker container ls ```

### **Configure** ( without docker ) 

To use the server you will have to configure the database you use.

In case of local deployment :

Install MongoDB

Create `flex` database

An other and easy way is to use [mlab](https://docs.mlab.com/).

You have to pass variables as environment variables.

Check the mongo configuration variables environnement :

Add a `.env` file at the root of the project.
Use 'local' mode for local deployment or 'remote' for cloud deployment.
```
API_SECRET=   // secret key

DATABASE_URL=   // For mlab
DATABASE_HOST=host.docker.internal // Must use this specific hostname for mac users only
DATABASE_PORT=
DATABASE_USERNAME=  // mlab user
DATABASE_PASSWORD=  // mlab password
DATABASE_DB=
DATABASE_MODE=remote // 'local' || 'remote'
```

### Installing

There is two ways to install the server:

#### Using npm

```
npm install
```

#### 2. Using yarn

```
yarn install
```
### Run

#### 1. Using npm

```
npm run build:live
```

#### 2. Using yarn

```
yarn run build:live
```

### **Create an API token for use**

Now you can access the API using localhost.
Open your browser and type url `localhost:3000/api`.
If you got the message "It works !", everything goes well.

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

I recommend you to use [Let's Encrypt](https://letsencrypt.org/).    
You have to create a self-signed certificate with openSSL :

```openssl req -nodes -new -x509 -keyout server.key -out server.cert```

And put the `cert.pem` and `key.pem` under a folder `cert` in `./app`.

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

You can run the tests under the `app/test` folder by running the command `npm run test`.


## Crypto operations

Crypto logic is currently written in `js` but we want to implement this logic using `golang` which will lead to performance gains. You can find the crypto-golang module under the `crypto-go` folder.
The go code is then compiled to C++ and imported into node JS app.

For running the crypto algrithms written in go, you have to create a new file at the root of the project : `binding.gyp` and insert :
```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "crypto-go/crypto.cc" ],
      "libraries": [ "<!(pwd)/crypto.so" ]
    }
  ]
}
```

Note: This file should always be there but it makes the installation on Circle CI fails.


## Use the API

You can find the begining of the API documentation [here](https://app.swaggerhub.com/apis-docs/ayshiff/flex-server-bred/0.1).


## Deployment

For deployment, I recommend using [Heroku](https://dashboard.heroku.com/apps).

## Built With

TODO

## Contributing 
- Check the current opened issues
- Fork the project
- Create your feature branch (git checkout -b - my-new-feature)
- Commit your changes (git commit -m 'Add some feature')
- Push your branch (git push origin my-new-feature)
- Create a new Pull Request


## Versioning
Semantic Versioning Specification (SemVer)

## Authors


## License


## Acknowledgments


