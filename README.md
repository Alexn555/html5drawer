## HTML5 Draw Poker game

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

![ScreenShot](http://norwaydict.com/html5games/html5drawer/html5drawer.png)

## Overall Description

Hello and Welcome to HTML5 Draw poker game.
This game was made using React (v18), SCSS modules and 
without any Canvas.
Also React-mitt was used to connect component with pubSub pattern, that is, signals.
Game only for 2 players -> Hero (You) and Opponent (AI player).

Demo: 
[link](https://norwaydict.com/html5games/html5drawer/)


NOTICE: 
This game uses Session Storage to save user settings.
Just good notice.

Structure: 
In terms of code game uses React, React-mitt, react-slider, use-sound
hook for SoundManager.
Typically classic approach and connection between components
is done using react-mitt events, emit, on handlers.
Settings are saved using sessionStorage helper.

In terms CSS, SCSS modules are used in any serious component.
Also some variables, mixins.

You can easily change global configurations inside 
  src/common/constants/config.ts

RUN Application
Usual `npm run start` inside game folder.

GNU General Public v3 License,
Freely images, sounds and codebase can (I would like) 
to be used for Your personal purposes.
You can freely fork and modify as your project.

