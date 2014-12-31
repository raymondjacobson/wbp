#White Blank Page

Forget accounts, forget user interfaces. You have things to do and ideas buzzing around, put them down, get on with your life.

stack: mongodb, react, go

dependencies:
- mgo (https://labix.org/mgo)
- React (http://facebook.github.io/react/)
- Browserify (http://browserify.org/)
- Watchify (https://github.com/substack/watchify)
- Stylus (http://www.stylus.com/)

## Up & Running
```bash

  $ stylus -w pub/style # compile css
  $ watchify components.js -o bundle.js # browserify js
  $ go run server.go

```
