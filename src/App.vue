<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { provide, reactive } from 'vue'
import { GameScore, GameScoresProvider } from '@/types';

const gameScores = reactive<GameScore[]>([]);

const addGameScore = (score: number) => {
  gameScores.push({score, date: new Date().toLocaleString()});
}

provide<GameScoresProvider>('gameScores', {
  gameScores,
  addGameScore
});
</script>
