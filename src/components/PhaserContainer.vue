<template>
    <div id="game">
      <ion-button v-if="showLaunch" @click="handleClickStart">Start</ion-button>
      <ion-checkbox v-if="showLaunch" labelPlacement="end" v-model="showRules">Show Rules?</ion-checkbox>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue'
import { IonButton, IonCheckbox } from '@ionic/vue';
import { Game} from 'phaser';
import { launch } from '@/game/game'
import { GameScoresProvider } from '@/types';

const showLaunch = ref(true)
const showRules = ref(true)
let gameInstance: Game;

const { gameScores, addGameScore } = inject<GameScoresProvider>('gameScores')!;


function handleClickStart() {
  // hides launch button and rules checkbox
  showLaunch.value = false;

  // only include StartScene if showRules is true
  const includedScenes = showRules.value ? ['StartScene', 'PlayScene', 'PauseScene', 'ScoreScene'] : ['PlayScene', 'PauseScene', 'ScoreScene']

  // launch the game
  gameInstance = launch(includedScenes);
}

function handleGameEnded(event: Event) {
  const customEvent = event as CustomEvent;
  addGameScore(customEvent.detail.score);
}


onMounted(() => {
  window.addEventListener("gameEnded", handleGameEnded);
});

onUnmounted(() => {
  window.removeEventListener("gameEnded", handleGameEnded);
});
</script>

<style scoped>
#game {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>