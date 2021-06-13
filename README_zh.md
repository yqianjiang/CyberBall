### Cyberball（抛球游戏）游戏版

[English](./README.md)


一个多人在线抛球游戏。启发自Cyberball实验范式 (Williams et al., 2000)，该范式主要用于研究社会排斥（social exclusion）等。

游戏人数为3～9人，当你拿到球的时候，你可以自由选择把球抛给谁。



### 项目架构

```js
├── main.js                    # 项目入口
├── App.vue                    # 组件入口
├── images                     # 图片目录
│   ├── Ball.png
│   └── Cyberboy
│        └── idle-right.png
│
├── components                 # 公共组件目录
│   ├── Ball.vue               # 球
│   ├── NavButton.vue          # 页面切换按钮
│   ├── Player.vue     				 # 单个玩家
│   └── PlayerImg.vue  				 # 单个玩家的图片
│
├── views                      # 页面目录
│   ├── Home.vue               # 主页
│   ├── Game.vue               # 游戏页面
│   └── PreGame.vue            # 游戏准备页面
│
├── router/index.js            # 路由
└── stores/index.js            # 全局状态管理 
```




---

参考资料:

[1] Williams, K. D., Cheung, C. K. T., & Choi, W. (2000). CyberOstracism: Effects of being ignored over the Internet. *Journal of Personality and Social Psychology, 79,* 748-762.

[2] Cyberball实验网站：http://www3.psych.purdue.edu/~willia55/Announce/cyberball.htm