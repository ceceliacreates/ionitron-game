<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Scores</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content >
      <pre>{{ gameScores }}</pre>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { inject } from 'vue'
import { GameScoresProvider } from '@/types';

const { gameScores } = inject<GameScoresProvider>('gameScores')!;
</script>
