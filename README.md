# Flex Server

The project is an API for manage places of users in a building. The project is a docker that makes himeasy to deploy.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You have to install nodeJs from the [official website](https://nodejs.org/en/download/)

You can check that everything is ok by typing: `nodejs -v` and `npm -v`

### Configure

To use the server you will have to configure the database you use.
The easiest way is to use [mlab](https://docs.mlab.com/).

You have to pass variables as environment variables or on the `/config/mlab` file.

### Installing

There is 2 was to install the server:

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
On the Url type `localhost:3000/api`.
If you got the message "API", everything goes well.

By typing the following command on your terminal or sending same informations on Postman or similar tool you will get an API token that can be used to access to other services of the API.

```
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST -d "name=<User name>&email=<User mail>&password=<User password>" http://localhost:3000/api/register
```

Once registered you can type this to get the API token again.

```
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST -d "email=<User mail>&password=<User password>" http://localhost:3000/api/login
```

You have to send the API token on the headers as `x-access-token` to access API content.

### Use the API


## Deployment

Add additional notes about how to deploy this on a live system

## Built With


## Contributing



## Versioning


## Authors


## License


## Acknowledgments


