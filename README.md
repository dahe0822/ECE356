# ECE356
ECE356 Project

## How to run
1. Inside the root folder of the app (/social_network_356), run `npm install`. Then,
2. Either:
   - run the whole thing: run `npm start`
      - This will execute both server.js (our backend/API at localhost:5000) and App.js (frontend at localhost:3000)
   - Or to run just the API: `node -r dotenv/config server`

## Structure
### App
- React front-end and Node.js to serve an API

### API
- In server.js, is a list of routes that call mySQL queries.
- For example, calling `GET http://localhost:5000/api/posts` will fetch all the posts

### Login credential to Database from local
- user: admin
- host: database-1.cyaj1ztyhbeh.ca-central-1.rds.amazonaws.com
- password: ###########
