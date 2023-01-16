<template>
  <div class="playArea">
    <div class="header">
      <div class="gameOver" v-if="isGameOver">Game Over</div>
      <div>
        <div class="info">Pause / Resume : Space</div>
        <div class="info">Move : Arrows</div>
      </div>
      <div class="headerLeft">
        <button class="startButton" @click="createBox()">
          {{ isGameOver ? "Reload" : "Start" }} Game
        </button>
        <div>
          <div>Max-Difference</div>
          <input class="limitInput" v-model="maxLimit" />
        </div>
      </div>
      <div class="headerRight">
        <div>Left Point: {{ leftPoint }}</div>
        <div>Right Point: {{ rightPoint }}</div>
      </div>
    </div>
    <div class="main">
      <div ref="dropContainer" class="dropContainer">
        <div ref="board" class="board"></div>
        <div class="pivot"></div>
      </div>
    </div>
  </div>
</template>

<script>
import RandomBox from "@/components/Box.vue";
import { createApp } from "vue";
import { boardSides, boxTypes, colorList } from "@/helpers/constants";
import { getRandomInt } from "@/helpers/mathFunctions";
let currentDegree = 0;
let currentSide = boardSides.right;
const rotateOptions = {
  duration: 400,
  iterations: 1,
  fill: "forwards",
};
export default {
  name: "home-page",
  data: function () {
    return {
      leftSide: [],
      rightSide: [],
      leftPoint: 0,
      rightPoint: 0,
      maxLimit: 20,
      isGameOver: false,
    };
  },
  computed: {
    completedBox() {
      return this.$store.state.completedBox;
    },
  },
  watch: {
    leftSide: {
      deep: true,
      handler() {
        this.handleBoxes();
      },
    },
    rightSide: {
      deep: true,
      handler() {
        this.handleBoxes();
      },
    },
    completedBox: {
      deep: true,
      handler(newBox) {
        switch (newBox.boxSide) {
          case boardSides.left:
            this.leftSide.push(newBox);
            break;
          case boardSides.right:
            this.rightSide.push(newBox);
            break;
          default:
            break;
        }
      },
    },
  },
  methods: {
    handleBoxes() {
      let rigtMoment = 0;
      let leftMoment = 0;
      this.leftSide.forEach((item) => {
        const moment = item.boxRange * item.boxValue;
        leftMoment += moment;
      });
      this.rightSide.forEach((item) => {
        const moment = item.boxRange * item.boxValue;
        rigtMoment += moment;
      });
      const absoluteVal = Math.abs(leftMoment - rigtMoment);
      const degree =
        ((leftMoment > rigtMoment ? -1 : 1) * (absoluteVal * 30)) /
        this.maxLimit;
      this.leftPoint = leftMoment;
      this.rightPoint = rigtMoment;
      if (absoluteVal >= this.maxLimit) {
        this.gameOver();
        return;
      }
      this.rotateBoard(degree - currentDegree);
      currentSide =
        currentSide === boardSides.right ? boardSides.left : boardSides.right;
      this.createBox();
    },
    gameOver() {
      this.isGameOver = true;
    },
    rotateBoard(deg) {
      const nextDeg = currentDegree + deg;
      const rotateBoard = [{ transform: "rotate(" + nextDeg + "deg)" }];
      currentDegree = nextDeg;
      this.$refs.board.animate(rotateBoard, rotateOptions);
      this.$store.commit("setBoardAngle", { angle: nextDeg });
    },
    createBox() {
      if (this.isGameOver) {
        location.reload();
      } else {
        const boxProps = {
          playAreaRect: this.$refs.dropContainer.getBoundingClientRect(),
          side: currentSide,
          range: getRandomInt(5) + 1,
          value: getRandomInt(10) + 1,
          color: colorList[getRandomInt(10)],
          type: Object.values(boxTypes)[getRandomInt(3)],
          order: this.leftSide.length + this.rightSide.length + 1,
        };
        const d = document.createElement("div");
        const box = createApp(RandomBox, { ...boxProps }).mount(d);
        this.$refs.dropContainer.appendChild(box.$el);
      }
    },
  },
};
</script>

<style scoped>
.playArea {
  display: flex;
  height: 100%;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 100px;
}
.dropContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  border: 1px solid #455861;
  flex: 1;
  width: 1000px;
}
.pivot {
  height: 0;
  width: 0;

  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 250px solid #455861;
}
.board {
  width: 1000px;
  height: 10px;
  background-color: rgb(203, 4, 4);
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 24px;
  background-color: #f5f5f5;
  border: 1px solid #455861;
  font-family: "Comic Sans MS", serif;
  font-size: 16px;
}
.headerLeft {
  display: flex;
  flex-direction: column;
}
.headerLeft div {
  margin-top: 12px;
}
.startButton {
  cursor: pointer;
  font-family: "Comic Sans MS", serif;
  background-color: brown;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}
.limitInput {
  font-family: "Comic Sans MS", serif;
  height: 24px;
  border-radius: 8px;
}
.headerRight {
}
.gameOver {
  font-family: "Comic Sans MS", serif;
  font-size: 14px;
  margin-bottom: 22px;
}
.info {
  font-family: "Comic Sans MS", serif;
  font-size: 14px;
  margin-bottom: 12px;
}
</style>
