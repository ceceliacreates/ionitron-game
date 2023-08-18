<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Play</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content >
        <PhaserContainer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import PhaserContainer from '@/components/PhaserContainer.vue';

</script>

<style scoped>
#game {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>