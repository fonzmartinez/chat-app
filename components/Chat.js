import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {

  const { name, color } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={styles.bgColor}
        backgroundColor={color}
      >
        <Text>Hello Chat Screen!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgColor: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%"
  },
});

export default Chat;
