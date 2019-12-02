# Car game 
# 2D online car simulator with AI
See working example here http://dweiner.ru/car/

### Technologies
* ES6
* Webpack 4
* Neataptic.js https://wagenaartje.github.io/neataptic/docs/

### Installation
1. Install node.js modules 
```npm i```

2. Patch neatapic library to avoid "Module not found: Error can't resolve 'child_process'"
https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix

### Training from the beginning:

```npm run train```

### Training previously saved population:
Using this file src/scripts/population.mjs

```npm run train continue```

### View in browser:

```npm start```

### Build for production:

```npm run build```