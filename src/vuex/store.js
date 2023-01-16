import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      boardAngle: 0,
      animationStatus: true,
      completedBox: {},
      isGameOver: false,
    };
  },
  mutations: {
    setBoardAngle(state, { angle }) {
      state.boardAngle = angle;
    },
    setAnimationStatus(state, { status }) {
      state.animationStatus = status;
    },
    setCompletedBox(state, { box }) {
      state.completedBox = box;
    },
    setGameOver(state, { status }) {
      state.isGameOver = status;
    },
  },
});

export default store;
