import { useState, useEffect } from 'react';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import CustomActions from './CustomActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';


const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const { userID } = route.params;
  const [messages, setMessages] = useState([]);
  const { name, color } = route.params;

  let unsubMessages;

  useEffect(() => {

    if (isConnected === true) {

      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      navigation.setOptions({ title: name });
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      })
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#00b2b2"
        },
        left: {
          backgroundColor: "#d9d9d9"
        }
      }}
    />
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  return (
    <View style={styles.container}
      backgroundColor={color}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: name
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center'
  },
  /*
      ***No longer using styling for background color***
    bgColor: {
      justifyContent: 'center',
      alignItems: 'center',
      width: "100%",
      height: "100%"
    },
    */
});

export default Chat;
