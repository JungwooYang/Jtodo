import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  useEffect(() => {
    loadTodos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveTodos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const loadTodos = async () => {
    try {
      const load = await AsyncStorage.getItem(STORAGE_KEY);
      if (load !== null) {
        setTodos(JSON.parse(load));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = () => {
    if (text === "") {
      return;
    }
    const newTodos = {
      ...todos,
      [Date.now()]: { text, working },
    };
    setTodos(newTodos);
    saveTodos(newTodos);
    setText("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
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
        <ScrollView>
          {Object.keys(todos).map((key) =>
            todos[key].working === working ? (
              <View style={styles.todo} key={key}>
                <Text style={styles.todoText}>{todos[key].text}</Text>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
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
    flex: 1.2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    paddingHorizontal: 5,
    fontSize: 16,
    borderBottomColor: "white",
    borderBottomWidth: 2,
    color: "white",
    marginBottom: 30,
    fontWeight: "600",
  },
  todo: {
    backgroundColor: theme.lightgray,
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  todoText: { color: "white", fontSize: 16, fontWeight: "400" },
});
