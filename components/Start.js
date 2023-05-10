import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", { userID: result.user.uid, name: name, color: color });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/BackgroundImage.png')}
        style={[styles.container, styles.image]}
      >
        <Text style={styles.title}>Chat App</Text>

        <View style={styles.nameBox}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your name'
          />

          <Text>Choose Background Color</Text>
          <View style={styles.colorButtonContainer}>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#090C08' }]}
              onPress={() => setColor('#090C08')}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#474056' }]}
              onPress={() => setColor('#474056')}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#8A95A5' }]}
              onPress={() => setColor('#8A95A5')}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#B9C6AE' }]}
              onPress={() => setColor('#B9C6AE')}
            ></TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.textInput, styles.chatBox]}
            onPress={signInUser}
          >
            <Text style={[styles.chatBoxText]} >
              Start Chatting
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%"
  },
  textInput: {
    width: "88%",
    color: '#757083',
    opacity: 100,
    fontWeight: '300',
    fontSize: 16,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15
  },
  title: {
    height: "44%",
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 45,
    paddingVertical: 70
  },
  colorButtonContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameBox: {
    backgroundColor: '#fff',
    marginBottom: 20,
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatBox: {
    backgroundColor: '#757083',
    justifyContent: 'center',
  },
  chatBoxText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  },
});

export default Start;
