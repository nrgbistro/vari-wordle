# Vari-Wordle

## Description
Vari-Wordle is a [Wordle](https://www.nytimes.com/games/wordle/index.html)* clone that allows users to play the game with a variety of different word lengths. The game is built using React and Typescript with an express backend. It's connected to a firestore that stores the current and historical words. The game is self-hosted using docker.

## Available Scripts
In the project directory, you can run:

### `yarn start`

Runs the app in production mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser. Requires the `build` directory to be present

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

CURRENTLY BROKEN - Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn dev`

Runs the app in the development mode with nodemon.\
Concurrently starts the server and the client and proxies api requests to the local server.

### `yarn backend`

Runs the server in the development mode with nodemon.\
Used to test changes made to the server without needing to start the client.

### `yarn docker-dev-build`

Builds the docker image for development.\
This command helps locally testing the Dockerfile.

### `yarn docker-dev-start`

Runs the docker image for development.\

\* all credit to New York Times for the original game
