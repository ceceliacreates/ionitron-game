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
        gameScores.splice(0, gameScores.length, ...parsedScores);
    }
};

// saves game scores to local storage

const saveGameScores = async () => {

  const scoresString = JSON.stringify(gameScores);

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

    // adds score to gameScores
    gameScores.push({score, rating, date: new Date().toLocaleString()});

    // calls function to save to local storage
    saveGameScores();
}

// Load scores from local storage when the component is initialized
loadGameScores();

// clears game scores from local storage

const clearGameScores = async () => {
    gameScores.splice(0, gameScores.length);
    saveGameScores();
}

provide<GameScoresProvider>('gameScores', {
  gameScores,
  addGameScore,
  clearGameScores
});
</script>
