function usePlayer() {
  const player = reactive({
    num: 4,
    numInput: 4,
    turnDur: 0.5,
    filter: "sepia(1) saturate(20)",
    hue: 180,
    gray: 0,
    name: ["", "1", "2", 3, 4, 5, 6, 7, "8"],
    isLeftWard: [
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
    ],
    refs: [],
  })

  const _playerRects = {
    mode1: [
      "3 / 2 / auto / 4",
      "2 / 1",
      "2 / 4",
      "1 / 2 / auto / 4",
      "3 / 3",
      "1 / 3",
      "1 / 1 / 3",
      "1 / 4 / 3",
      "3 / 1 / auto / 3",
    ],
    mode2: [
      "3 / 2",
      "2 / 1 / 4",
      "2 / 4 / 4",
      "1 / 2",
      "3 / 3 / auto / 5",
      "1 / 4 / 3",
      "1 / 1 / 3",
      "1 / 4 / 3",
      "3 / 1 / auto / 3",
    ],
  }

  const _modeMap = {
    3: [],
    4: [],
    5: [0],
    6: [0, 3],
    7: [0, 1, 2, 5],
    8: [0, 1, 2, 3],
    9: [1, 2, 3, 4],
  }

  const playerStyle = computed(()=>{
    const getStyleStr = (hue, gray, turnDur) =>
    `filter: ${player.filter} hue-rotate(${hue}deg) grayscale(${gray}%); transition:${turnDur}s linear`;

    const newList = [
      getStyleStr(player.hue, player.gray, player.turnDur),
    ];

    for (let i = 1; i < player.num; i++) {
      newList.push(getStyleStr(Math.random() * 360, Math.random() * 100, 0));
    }

    return newList;    
  })

  const gridArea = computed (() => {
    const getGridArea = (i) => {
      if (_modeMap[player.num].includes(i)) {
        return `grid-area: ${_playerRects.mode2[i]}`;
      } else {
        return `grid-area: ${_playerRects.mode1[i]}`;
      }
    };

    const newList = [];
    for (let i = 0; i < player.num; i++) {
      newList.push(getGridArea(i));
    }
    return newList;
  })

  function setPlayerRef(refItem) {
    if (refItem) {
      player.refs.push(refItem);
    }
  }

  function checkPlayerNum() {
    if (player.numInput in _modeMap) {
      player.num = player.numInput;
      this.reactiveBallPos();
    } else if (player.numInput !== "") {
      alert("请输入3-9之间的数值！");
      player.numInput = player.num;
    }
  }

  function checkNameInput() {
    let name = player.name[0];
    if (!name) {
      alert("请输入昵称！");
      return true;
    } else if (name.length > 10) {
      alert("名字太长了！");
      return true;
    }
  }

  //initPlayer00??

  return {
    player,
    playerStyle,
    gridArea,
    setPlayerRef,
    checkPlayerNum,
    checkNameInput
  }
}