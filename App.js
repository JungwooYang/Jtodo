import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { theme } from "./colors";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addTodo = () => {
    if (text === "") {
      return;
    }
    const newTodos = Object.assign({}, todos, {
      [Date.now()]: { text, work: working },
    });
    setTodos(newTodos);
    setText("");
    console.log(newTodos);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text
            onPress={work}
            style={{
              ...styles.btnText,
              color: working ? "white" : theme.lightgray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={travel}
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.lightgray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          value={text}
          returnKeyType="done"
          placeholder={
            working ? "what do you have to do?" : "what do you want to do?"
          }
          placeholderTextColor={theme.deepgray}
          style={styles.input}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "gold",
  },
  btnText: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
  },
  body: {
    flex: 3,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 3,
    fontSize: 20,
    borderBottomColor: "white",
    borderBottomWidth: 3,
    color: "white",
  },
});
