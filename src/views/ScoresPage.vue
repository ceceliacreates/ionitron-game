<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Scores</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
    <ion-item>
      <ion-select aria-label="sort" interface="popover" v-model="sort">
        <ion-select-option value="highest">Highest Score</ion-select-option>
        <ion-select-option value="lowest">Lowest Score</ion-select-option>
        <ion-select-option value="latest">Latest</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
  <h3 v-show="!gameScores.length">No scores yet!</h3>
      <ion-list>
        <ion-item v-for="(score, index) in sortedScores" :key="index">
          <ion-label>
            <h2>Score: {{ score.score }} {{ score.rating }}</h2>
            <p>{{ score.date }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { inject, computed, ref } from 'vue'
import { GameScoresProvider } from '@/types';

const { gameScores } = inject<GameScoresProvider>('gameScores')!;
const sort = ref("latest");

const sortedScores = computed(() => {
  return gameScores.sort((a, b) => {
    switch (sort.value) {
      case "highest":
        return b.score - a.score;
      case "lowest":
        return a.score - b.score;
      case "latest":
        return (
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      default:
        return 0;
    }
  });
});

</script>

<style scoped>
ion-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0;
}
</style>
