<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="play" href="/home/play">
          <ion-icon aria-hidden="true" :icon="gameControllerOutline" />
          <ion-label>Play</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/home/about">
          <ion-icon aria-hidden="true" :icon="helpOutline" />
          <ion-label>About</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="scores" href="/home/scores">
          <ion-icon aria-hidden="true" :icon="trophyOutline" />
          <ion-label>Scores</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { gameControllerOutline, helpOutline, trophyOutline } from 'ionicons/icons';
</script>
