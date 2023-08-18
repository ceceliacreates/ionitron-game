<template>
    <div id="game">
      <ion-button v-if="startButtonVisible" @click="handleClickStart">Play</ion-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonButton } from '@ionic/vue';
import { Game} from 'phaser';
import { launch } from '@/game/game'

const startButtonVisible = ref(true)
let gameInstance: Game;

function handleClickStart() {
  startButtonVisible.value = false;
  gameInstance = launch();
}
</script>