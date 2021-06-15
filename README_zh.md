# Cyberball 抛球游戏

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-3.1.1-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/yqianjiang/CyberBall/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>


[English](./README.md) | 简体中文




一个多人在线抛球游戏。启发自Cyberball实验范式 (Williams et al., 2000)，该范式主要用于研究社会排斥（social exclusion）等。

游戏人数为3～9人，当你拿到球的时候，你可以自由选择把球抛给谁。



## 目标功能

- [x] 玩家颜色选择
- [x] 游戏人数选择
- [x] 记分功能
- [ ] 投球偏好规则
- [ ] 排行榜
- [ ] 最高纪录
- [ ] 多语言
- [ ] 多人联网



## 项目结构

```js
src
├── main.js                    # 项目入口
├── App.vue                    # 组件入口
├── images                     # 图片目录
│
├── components                 # 公共组件目录
│   ├── Ball.vue               # 球
│   ├── NavButton.vue          # 页面切换按钮
│   ├── ScoreBoard.vue         # 记分板
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



## 参考资料

[1] Williams, K. D., Cheung, C. K. T., & Choi, W. (2000). CyberOstracism: Effects of being ignored over the Internet. *Journal of Personality and Social Psychology, 79,* 748-762.

[2] Cyberball实验网站：http://www3.psych.purdue.edu/~willia55/Announce/cyberball.htm



## License

[MIT](https://github.com/yqianjiang/CyberBall/blob/main/LICENSE)

Copyright (c) 2021 yqianJiang
