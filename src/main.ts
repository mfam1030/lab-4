import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue, alertController, AlertOptions } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Ionic Dark Mode */
import "@ionic/vue/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";


import OneSignal, { NotificationClickEvent, NotificationWillDisplayEvent } from "onesignal-cordova-plugin";

const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
  app.mount("#app");

  // Inicializar OneSignal
  OneSignal.initialize("ea3369eb-bd7b-4c01-8068-55bceb4e89b7");
  OneSignal.Notifications.requestPermission();

 
  const interval = setInterval(async () => {
    const id = await OneSignal.User.getOnesignalId();
    console.log("OneSignal ID:", id);

    if (id) {
      clearInterval(interval);
    }
  }, 60000);

 
  const displayNotification = async (event: NotificationWillDisplayEvent) => {
    const notification = event.getNotification();
    event.getNotification().display(); 

    console.log("Notificación recibida:", notification);

    
    const alertOptions: AlertOptions = {
      header: notification.title,
      message: notification.body,
      buttons: ["OK"],
    };
    const alert = await alertController.create(alertOptions);

    await alert.present();
  };

  OneSignal.Notifications.addEventListener("foregroundWillDisplay", displayNotification);


  const openNotification = async (event: NotificationClickEvent) => {
    const notification = event.notification;
    console.log("Notificación clickeada:", notification);

   
    const alert = await alertController.create({
      header: notification.title,
      message: notification.body, 
      buttons: ["OK"],
    });

    await alert.present();
  };

  OneSignal.Notifications.addEventListener("click", openNotification);
});