<template>
    <div id="game">
      <ion-button v-if="startButtonVisible" @click="handleClickStart">Play</ion-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue'
import { IonButton } from '@ionic/vue';
import { Game} from 'phaser';
import { launch } from '@/game/game'
import { GameScoresProvider } from '@/types';

const startButtonVisible = ref(true)
let gameInstance: Game;

const { gameScores, addGameScore } = inject<GameScoresProvider>('gameScores')!;


function handleClickStart() {
  startButtonVisible.value = false;
  gameInstance = launch();
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