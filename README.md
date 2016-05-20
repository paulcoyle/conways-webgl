# Conway's WebGL

This is a simple implementation of Conway's Game of Life using a double-buffered
strategy in WebGL.  Why mess about with quadtrees and memoization when you can
have the GPU do the hard work for you?

# Building

You'll need `node.js` and `npm` installed.

    npm install -g webpack webpack-dev-server
    npm install

Run the development server with:

    webpack-dev-server

Build for deployment with:

    NODE_ENV=production webpack

The results of a production build can be found in `./dist`.
