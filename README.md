### Cyberball (game version)

[中文](./README_zh.md)


An online ball-tossing game inspired by the Cyberball experimental paradigm (Williams et al., 2000) for research on social exclusion, ostracism, etc.

The number of players in the game is 3-9. When you get the ball, you can choose who to throw it to.



### Project Structure

```js
├── main.js                    
├── App.vue                    
├── images                     
│   ├── Ball.png
│   └── Cyberboy
│        └── idle-right.png
│
├── components                 
│   ├── Ball.vue               
│   ├── NavButton.vue          
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








---

References:

[1] Williams, K. D., Cheung, C. K. T., & Choi, W. (2000). CyberOstracism: Effects of being ignored over the Internet. *Journal of Personality and Social Psychology, 79,* 748-762.

[2] Cyberball website：http://www3.psych.purdue.edu/~willia55/Announce/cyberball.htm