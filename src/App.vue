<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { provide, reactive } from 'vue'
import { GameScore, GameScoresProvider } from '@/types';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const gameScores = reactive<GameScore[]>([]);

// loads game scores from local storage

const loadGameScores = async () => {
    let scoresString = '';

    // checks if running on native platform to use preferences API
    // NOTE: Preferences API is meant for LIGHT DATA ONLY

    if (Capacitor.isNativePlatform()) {
        const result = await Preferences.get({ key: 'gameScores' });
        scoresString = result.value || '';
    } else {
        scoresString = localStorage.getItem('gameScores') || '';
    }

    if (scoresString) {

        const parsedScores = JSON.parse(scoresString);

        // adds rating to scores that were saved before rating was added
        if (parsedScores[0].score && !parsedScores[0].rating) {
            parsedScores.forEach((score: GameScore) => {
                score.rating = score.score >= 500 ? '⭐️⭐️⭐️⭐️⭐️' : score.score >= 400 ? '⭐️⭐️⭐️⭐️' : score.score >= 300 ? '⭐️⭐️⭐️' : score.score >= 200 ? '⭐️⭐️' : score.score >= 100 ? '⭐️' : 'Rejected 😭';
            });
        }

        gameScores.splice(0, gameScores.length, ...parsedScores);

        console.log(gameScores)
    }
};

// saves game scores to local storage

const saveGameScores = async (minimizedGameScores: Omit<GameScore, 'rating'>[]) => {

  const scoresString = JSON.stringify(minimizedGameScores);

  if (Capacitor.isNativePlatform()) {
    await Preferences.set({
        key: 'gameScores',
        value: scoresString
    });
  } else {
    localStorage.setItem('gameScores', scoresString);
  }
}

// Adds new score to gameScores reactive and saves it to local storage
const addGameScore = (score: number, rating: string) => {

    // only saves 10 scores at a time to reduce storage usage
    if (gameScores.length >= 10) {
        gameScores.shift();
    }

    // adds score to gameScores
    gameScores.push({score, rating, date: new Date().toLocaleString()});

    // minimizes gameScores to only include score and date
    const minimizedGameScores = gameScores.map(({score, date}) => ({score, date}));

    // calls function to save to local storage
    saveGameScores(minimizedGameScores);
}

// Load scores from local storage when the component is initialized
  loadGameScores();

// clears game scores from local storage

const clearGameScores = async () => {
    gameScores.splice(0, gameScores.length);

    // saves an empty array to local storage
    saveGameScores([]);
}

provide<GameScoresProvider>('gameScores', {
  gameScores,
  addGameScore,
  clearGameScores
});
</script>
