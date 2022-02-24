
https://JohansenJunias20.github.io  

see [Deploy Repository](https://github.com/JohansenJunias20/JohansenJunias20.github.io)  
<!-- ## Development
Run webpack build watch and nodemon websocket
```sh
    bash ./dev.sh
```
Please make sure [docker](https://docs.docker.com/) and [node](https://nodejs.org/en/) installed.   -->

## Production
Please install [Git bash](https://git-scm.com/downloads) and [Docker](https://docs.docker.com/)
Run Coturn Server, websocker server with forever, and build files  
```sh
> bash prod.sh
```
Only Build files **not serve files**, you still need to serve .html file with public folder as relative path. Use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)  
<hr />

<!-- COPY -->
| To do | Description   | Done    |
| :---: | ---- | :---: |
|[**Map Pointer**](https://forums.rpgmakerweb.com/data/attachments/109/109950-e5cb7855bfce5950a9c055d7053c9d00.jpg)|draw [2D Arrow](https://forums.rpgmakerweb.com/data/attachments/109/109950-e5cb7855bfce5950a9c055d7053c9d00.jpg) on screen if character's position off the map  |
|**Spawn Wave Effect** |Objects appear from underground to the surface in sequence, start from the center point (character spawn) towards outside  | ✅ |
|[**Post Processing**](https://threejs.org/examples/#webgl_postprocessing_dof2) | [Bloom](https://threejs.org/examples/#webgl_postprocessing_unreal_bloom) on Billboards Image, [Blur](https://threejs.org/examples/#webgl_postprocessing_dof2) Camera's Edges, [Selective Outline](https://threejs.org/examples/#webgl_postprocessing_outline) on _knowledge_ |
|**Responsive Mobile UI**|Add Joystick & fix blury noise when screen resized|✅|
|**Desc on _knowledges_**|Whenever user click a _knowledge_, it will show it's description on html modal|
|**Player List UI**  |Draw list of players & move camera to specific player when user click player's name |✅|
|**more _playground_**  |boardgame that can be played with bots or other players like [_connect 4_](https://en.wikipedia.org/wiki/Connect_Four)  |
|**Bots to _playground_**  |implement bots so players can play alone  |
|**Advanced Multiplayer**  |implement Multiplayer to _playground_  (play connect 4 with other players)  |
|**Add more _knowledges_**  | [nginx](https://www.nginx.com/), [tailwind](https://tailwindcss.com/), [adobe](https://www.adobe.com/), [docker](https://www.docker.com/), [expo](https://expo.dev/), [aws](https://aws.amazon.com/), [laravel](https://laravel.com/), [threejs](**https**://threejs.org/), [opengl](https://en.wikipedia.org/wiki/OpenGL)|
|**Add more _billboard projects_**  | [minecraft-clone](https://github.com/JohansenJunias20/minecraft-clone), Accounting Web, [Laughing Clown](https://github.com/JohansenJunias20/laughing-clown)|
|**Contact Person**|IG, [Github](https://github.com/JohansenJunias20), and LinkedIn at *lobby* Area|
|**Add more Shadows**|shadows on movable object like character(ball), johansen mesh, and hotkeys||
|**Add Documentation**|Write readme file in every directory|On Progress|
|**Dockerize Coturn**|image coturn/coturn seems to be broken, planning to make own custom coturn image| |
|**Chat**|Add chat so players can communicate with each other| |
<!-- |**Night Mode**|Change theme to night when || -->
<!-- ENDCOPY -->

## Notes

1. Please write `<!-- COPY --> content <!-- ENDCOPY -->` in readme file that you want to copy to [readme.md's JohansenJunias20.github.io](https://github.com/JohansenJunias20/JohansenJunias20.github.io/blob/master/readme.md)  
  
## Files
### .env 
- Config will be sent to `/src/*.tsx` through webpack config files
- `build.sh` is responsible for passing variables in .env to webpack config file
- Flow: `/.env` &#8594; `build.sh` &#8594; `webpack.(dev/prod).js` &#8594; `/src/*.tsx`

### build.sh
- Build `/src/*.tsx` files to `/public/dist/bundle.js`
- If you are not sure what arguments suit for you just call it from `dev.sh` or `prod.sh`
- Contain **2 arguments**
    - `-m | --mode DEV/PROD` specify the mode
      - mode **DEV** will pass dev config from .env file and use `webpack.dev.js` file config to compile `/src/*.tsx` files
      - mode **PROD** will pass prod config from .env file and use `webpack.prod.js` file config to compile `/src/*.tsx` files
    - `-d | --use-docker` with virtualization or not, if you dont have docker installed you can leave this option unwritten (assuming you have node js and npm installed).
      - On **windows**, **do not** use DEV mode with virtualization because **windows** are not signalling file changes to docker mounted volumes.

### copy_readme.sh
- Called by Github Actions to copy readme file from `portofolio` to `JohansenJunias20.github.io`
- Only copy several lines start with COPY tag and end with ENDCOPY tag in readme.md file

### dev.sh
- Run code on development mode. It will automatically find and run the most suit config for your OS
- You still need **live server extension** to serve `public/index.html` file
- What dev.sh will do:
  - Copy `.env` file to `ws-server/.env`
  - Run socket.io server locally with docker
  - Run webpack development mode and watch changes to `src/*.tsx`

### docker-compose.dev.yml
- Run socket.io server service and run `bash ws-server/dev.sh` inside container 
- Run by `dev.sh`
 
### docker-compose.prod.yml
- Run socket.io server service and run `bash ws-server/prod.sh` inside container
- Run by `prod.sh`

### internal_start-turn.sh
- Run Coturn Server based on .env config 
- Please make sure install Coturn first on your machine
- Named ***internal*** because it is only called by other script, do not run it manually
- Please use ubuntu server OS
- Called by `prod.sh`

### prod.sh
- Run this script to deploy the code to production. It will automatically find and run the most suit config for your OS
- You still need to use live server extension to server `public/index.html` file
- What prod.sh do:
  - Copy `.env` file to `ws-server/.env`
  - Run socket.io server locally with docker
  - Run webpack production mode
  - Run turn server by running `internal_start-turn.sh`

### ssl_renew.sh
- Renew ssl certificates for turn and ws domains if about to expired
- Docker required
- Make sure port 80 is not being used by other process
- Called by `prod.sh`

### turnserver.conf
- Config file for coturn server
- Please do not change manually
- This config based on `.env` config file
- Please configure coturn's config on `.env` file, `internal_start-turn.sh` will automatically copied to `turnserver.conf` file

### wepback.dev.js
- Webpack's config for development mode
- Used by `build.sh -m DEV`

### wepback.prod.js
- Webpack's config for production mode
- Used by `build.sh -m PROD`

