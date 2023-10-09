function useBall() {
  const ball = reactive({
    pos: [0, 0],
    moveDur: 0,
    owner: 1,
    receptor: 1,
  })

  function getTargetPos(dx, playerRefs) {
    // 供外部使用：提供playerRefs的列表（原this.player.refs），本函数会根据player得到对应的球的目标坐标。
    // 命名为：setBallPos
    const ballReceptor = playerRefs[ball.receptor];
    if (!ballReceptor) {
      console.log("reference error!");
      return ball.pos;
    }
    let posX = (ballReceptor.offsetLeft + dx) / (window.innerWidth / 100);
    let posY = (ballReceptor.offsetTop - BALL_DY) / fontSize;
    return [posX, posY];
  }

  function moveBall(receptorId = 0, ballMoveDur = 0.5, playerRefs, isPlayerLeftWard) {
    // 设置移动参数
    let dx = BALL_DX;
    if (isPlayerLeftWard[receptorId]) {
      dx = 0;
    }
    ball.moveDur = ballMoveDur;
    if (receptorId === "00") {
      ball.receptor = 0;
    } else {
      ball.receptor = receptorId + 1;
    }
    // 移动
    if (ball.receptor == ball.owner)
      return "don't need to move the ball";
    ball.pos = getTargetPos(dx, playerRefs);
    ball.owner = ball.receptor;

    // 如果球到其他玩家手中，执行一个判断...
    if (ball.owner > 1) {
      aiThrowBall();
    }
  }

  function reactiveBallPos(isPlayerLeftWard, playerRefs) {
      // 从自身移动到自身，不改变ball owner的值
      let dx = BALL_DX;
      if (isPlayerLeftWard[ball.owner - 1]) {
        dx = 0;
      }
      ball.moveDur = 0;
      ball.pos = getTargetPos(dx, playerRefs);
  }

  async function aiThrowBall(receptorId) {
    await Utils.sleep(AI_DELAY_T);
    moveBall(receptorId);
  }

  return {
    ball,
    reactiveBallPos,
    aiThrowBall,
    moveBall,
  }
}