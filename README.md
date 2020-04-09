# ECE356
ECE356 Project

## How to run 🏃‍♂️
1. The whole thing: `npm start`
    - This will execute both server.js (our backend/API at localhost:5000) and App.js (frontend at localhost:3000)
2. Or to run just the API: `node -r dotenv/config server`

## API
- In server.js, is a list of routes that call mySQL queries.
- For example, calling `GET http://localhost:5000/api/posts` will fetch all the posts

## Login credential to Database from local
- user: admin
- host: database-1.cyaj1ztyhbeh.ca-central-1.rds.amazonaws.com
- password: ###########
- mysql -u admin -h database-1.cyaj1ztyhbeh.ca-central-1.rds.amazonaws.com -p
