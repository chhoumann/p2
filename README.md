# P2 - Recommender Systems

## Project 2 source code for B2-24.
Implementation of a recommender system in a web application.

## Notes
We have chosen to use **ES6** for our JS code.
For testing our code, we have chosen **Jest**.
Furthermore, we use **NodeJS** (and *Express*) for our backend.
Any other choices will be noted here in the future.

Due to a multitude of packages used, and npm being available, *'node_modules'* has been included in *.git_ignore*.

Simply run ```npm install``` while inside the folder in order to retrieve the necessary packages (also see *Installation* below).

### Installation
NodeJS can be installed from their [official website](https://nodejs.org/en/download/). This will be used to install the remaining technologies.

Using ```npm install``` from inside the main directory for this application, the remaining packages will be installed.

### Testing with Jest
Simply run ```npm test``` to test.

### Running the server
1. If not done already: ```npm install```
2. ```npm start```
3. You can now find the web application locally running on http://localhost:8000

Due to Nodemon (NPM package) the server will automatically refresh with new updates in the files.
This is done to make the development & testing process easier.