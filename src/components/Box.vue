<template>
  <div ref="box" class="box"></div>
</template>

<script>
import store from "@/vuex/store";
import { toRadians } from "@/helpers/mathFunctions";
import { boardSides, boxTypes } from "@/helpers/constants";

const animationAlignOptions = {
  duration: 400,
  iterations: 1,
  fill: "forwards",
  easing: "linear",
};
export default {
  name: "random-box",
  data: function () {
    return {
      currentY: 0,
      animationFinished: false,
      boxRange: 0,
    };
  },
  props: ["range", "side", "value", "color", "type", "playAreaRect", "order"],
  created() {
    this.boxRange = this.range;
    console.log(this.type);
  },
  computed: {
    angle() {
      return store.state.boardAngle;
    },
    animationStatus() {
      return store.state.animationStatus;
    },
  },
  watch: {
    angle: {
      deep: true,
      handler() {
        this.alignBox();
      },
    },
    animationStatus: {
      deep: true,
      handler(status) {
        if (status) {
          this.animateBox();
        }
      },
    },
  },
  mounted() {
    this.createBox();
  },
  unmounted() {
    document.removeEventListener("keydown", this.handleKeyboard);
  },
  methods: {
    createBox() {
      switch (this.side) {
        case boardSides.right:
          this.$refs.box.style.right = "500px";
          break;
        case boardSides.left:
          this.$refs.box.style.left = "500px";
          break;
      }
      switch (this.type) {
        case boxTypes.circle:
          this.$refs.box.style.backgroundColor = this.color;
          this.$refs.box.style.width = `${this.value * 10 + 15}px`;
          this.$refs.box.style.height = `${this.value * 10 + 15}px`;
          this.$refs.box.style.borderRadius = `${this.value * 10 + 15}px`;
          this.$refs.box.innerText = `${this.value} kg`;
          break;
        case boxTypes.triangle:
          this.$refs.box.style.width = "0";
          this.$refs.box.style.height = "0";
          this.$refs.box.style.borderLeft = `${
            this.value * 10 + 10
          }px solid transparent`;
          this.$refs.box.style.borderRight = `${
            this.value * 10 + 10
          }px solid transparent`;
          this.$refs.box.style.borderBottom = `${
            this.value * 10 + 35
          }px solid ${this.color}`;
          this.$refs.box.innerHTML = `<div style="top: ${
            this.value + 10
          }px; position: absolute; text-align: center">
              ${this.value} kg
              </div>
              `;

          break;
        case boxTypes.rectangle:
          this.$refs.box.style.width = `${this.value * 10 + 15}px`;
          this.$refs.box.style.height = `${this.value * 10 + 15}px`;
          this.$refs.box.style.backgroundColor = this.color;
          this.$refs.box.innerText = `${this.value} kg`;
          break;
      }
      this.animateBox();
      document.addEventListener("keydown", this.handleKeyboard);
    },
    alignBox() {
      const transforms = [
        {
          transform:
            "translate(" +
            this.getXOffset() +
            "px, " +
            (this.playAreaRect.bottom -
              this.getYOffset() -
              102 -
              this.$refs.box.getBoundingClientRect().height) +
            "px)",
        },
      ];
      this.$refs.box.animate(transforms, animationAlignOptions);
    },
    handleKeyboard(event) {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (this.side === boardSides.right) {
            return;
          }
          if (this.side === boardSides.right) {
            if (this.boxRange < 5) {
              this.boxRange += 1;
            }
          } else if (this.side === boardSides.left) {
            if (this.boxRange > 1) {
              this.boxRange -= 1;
            }
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (this.side === boardSides.right) {
            return;
          }
          if (this.side === boardSides.right) {
            if (this.boxRange > 1) {
              this.boxRange -= 1;
            }
          } else if (this.side === boardSides.left) {
            if (this.boxRange < 5) {
              this.boxRange += 1;
            }
          }
          break;
        case " ":
          event.preventDefault();
          store.commit("setAnimationStatus", {
            status: !store.state.animationStatus,
          });
          break;
        default:
          break;
      }
    },
    animateBox: function () {
      if (this.animationStatus && !this.animationFinished) {
        const nextY = this.currentY + 10;
        const nextX = this.getXOffset();
        const transforms = [
          { transform: "translate(" + nextX + "px, " + nextY + "px)" },
        ];
        const animationOptions = {
          duration: this.order > 15 ? 25 : 100 - this.order * 5,
          iterations: 1,
          fill: "forwards",
          easing: "linear",
        };
        const animation = this.$refs.box.animate(transforms, animationOptions);
        animation.onfinish = () => {
          this.currentY = nextY;
          if (this.checkOverlap()) {
            this.animationFinished = true;
            document.removeEventListener("keydown", this.handleKeyboard);
            store.commit("setCompletedBox", {
              box: {
                boxValue: this.value,
                boxRange: this.boxRange,
                boxSide: this.side,
              },
            });
          } else {
            this.animateBox();
          }
        };
      }
    },
    checkOverlap() {
      const boxBottom = this.$el.getBoundingClientRect().bottom;
      return boxBottom > this.playAreaRect.bottom - this.getYOffset();
    },
    getXOffset() {
      const rad = toRadians(this.angle);
      const cosVal = Math.cos(rad);
      let offSet = 0;
      switch (this.side) {
        case boardSides.right:
          offSet = this.boxRange * 100 * cosVal;
          break;
        case boardSides.left:
          offSet = this.boxRange * -100 * cosVal;
          break;
      }
      return offSet;
    },
    getYOffset() {
      const rad = toRadians(this.angle);
      const sinVal = Math.sin(rad);
      let offSet = 0;
      switch (this.side) {
        case boardSides.right:
          offSet = 252 - this.boxRange * 100 * sinVal;
          break;
        case boardSides.left:
          offSet = 252 - this.boxRange * -100 * sinVal;
          break;
      }
      return offSet;
    },
  },
};
</script>

<style scoped>
.box {
  display: flex;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  font-family: "Comic Sans MS", serif;
  font-size: 12px;
}
</style>
