import React from 'react';
import {View, Button, Alert, Text, StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';

export default function App() {
  React.useEffect(() => {
    checkPermission();
    createNotificationListeners();
  }, []);

  const [token, setToken] = React.useState({
    fcmToken: '',
  });

  async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      const fcmToken = await firebase.messaging().getToken();
      setToken({
        fcmToken: fcmToken,
      });
    } else {
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {}
    }
  }

  async function sendNotification() {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAuPBdObo:APA91bHiNLpElUEFHbXs5kQwoVPGA0I5sc9AwmUlbUzrtqsyOm3GNZi2DyVV7V4qKmmZ3GmjYXncBnQJiwmhug7P5MsrYD52qs4lAe6yXKI_jg6k_rofUK-mM9lbgXkhlOTELjpOuzVo',
      },
      body: JSON.stringify({
        to: token.fcmToken,
        notification: {
		 android_channel_id: 'test-channel',
          title: 'hello',
          body: 'yo',
        },
		
		data: {
        channelId: 'test-channel'
    }
      }),
    });
  }

  async function createNotificationListeners() {
    const channel = new firebase.notifications.Android.Channel(
      'test-channel',
      'Test Channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('My apps test channel');
    firebase.notifications().android.createChannel(channel);
    firebase.notifications().onNotification((notifications) => {
      firebase.notifications().displayNotification(notifications);
      console.log(notifications);
      const {title, body} = notifications;
      Alert.alert(title, body);
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
