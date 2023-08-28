<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ion-text-center ion-padding">
        <h1>Ionitron: The Game</h1>
        <p>
        Created with Phaser, Ionic, Capacitor, and Vue 👾💙💚
      </p>
      </div>
      <div class="ion-padding-horizontal">
      <p>
        In this game, you are Ionitron, a hard-working cross-platform developer! You use your web skills to build mobile apps for iOS and Android using Ionic and Capacitor. 
      </p>
      <p>
        The success of your apps depend on creating a great user experience.
        Your score increases when your users are happy, but unhappy users can tank your rating. Whatever you do, avoid the bugs!
      </p>
      <p>
        New test devices and a hot pot of coffee will prevent bugs and bad reviews, but they don't last forever.
      </p>
      <p>
        Good luck!
      </p>
    </div>
    <div class="ion-text-center ion-padding-horizontal">
      <h3>Learn More</h3>
      <ion-list>
        <ion-item>
          <ion-label>Phaser</ion-label>
          <ion-button href="https://phaser.io/" target="_blank" fill="clear" slot="end">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label>Ionic</ion-label>
          <ion-button href="https://ionicframework.com/" target="_blank" fill="clear" slot="end">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label>Capacitor</ion-label>
          <ion-button href="https://capacitorjs.com/" target="_blank" fill="clear" slot="end">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-label>Vue</ion-label>
          <ion-button href="https://v3.vuejs.org/" target="_blank" fill="clear" slot="end">
            <ion-icon :icon="openOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/vue';
import { openOutline } from 'ionicons/icons';
import PageContainer from '@/components/PageContainer.vue';
</script>

<style scoped>
ion-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
