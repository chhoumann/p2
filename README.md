# P2 - Recommender Systems

## Project 2 source code for B2-24.
Implementation of a recommender system in a web application.

## To run the server:
1. If running for the first time: ```npm install```
2. ```npm run start```
3. You can now find the web application locally running on http://localhost:3000

Due to Nodemon (NPM package) the server will automatically refresh with new updates in the files.
This is done to make the development & testing process easier.

## Notes
We have chosen to use **TypeScript** for our JS code.
For testing our code, we have chosen **Jest**.
Furthermore, we use **NodeJS** (and *Express*) for our backend.
Any other choices will be noted here in the future.

### Installation
NodeJS can be installed from their [official website](https://nodejs.org/en/download/). This will be used to install the remaining technologies.
Jest: ```npm install --save-dev jest```
TypeScript: ```npm install -g TypeScript```
Then, using ```npm install``` from inside the main directory for this application, the remaining packages will be installed.

### Compiling TypeScript
Use ```tsc filename.ts``` to compile a TypeScript file.