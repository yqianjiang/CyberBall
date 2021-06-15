# Cyberball (game version)

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-3.1.1-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/yqianjiang/CyberBall/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>

English | [简体中文](./README_zh.md)



An online ball-tossing game inspired by the Cyberball experimental paradigm (Williams et al., 2000) for research on social exclusion, ostracism, etc.

The number of players in the game is 3-9. When you get the ball, you can choose who to throw it to.



## Features

- [x] Customize Player Color
- [x] Select Player Number
- [x] Scoring
- [ ] Preference of throwing ball
- [ ] Ranking
- [ ] Highest Score
- [ ] Multi-language
- [ ] Online Multi-player



## Project Structure

```js
src
├── main.js                    
├── App.vue                    
├── images                     
│
├── components                 
│   ├── Ball.vue               
│   ├── NavButton.vue 
│   ├── ScoreBoard.vue          
│   ├── Player.vue     				 
│   └── PlayerImg.vue  				 
│
├── views                      
│   ├── Home.vue               
│   ├── Game.vue               
│   └── PreGame.vue
│
├── router/index.js            
└── stores/index.js             
```



## References

[1] Williams, K. D., Cheung, C. K. T., & Choi, W. (2000). CyberOstracism: Effects of being ignored over the Internet. *Journal of Personality and Social Psychology, 79,* 748-762.

[2] Cyberball website：http://www3.psych.purdue.edu/~willia55/Announce/cyberball.htm



## License

[MIT](https://github.com/yqianjiang/CyberBall/blob/main/LICENSE)

Copyright (c) 2021 yqianJiang