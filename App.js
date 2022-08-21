import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  useEffect(() => {
    loadTodos();
  }, []);
  const play = () => setWorking(false);
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
  const deleteTodo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Are you sure to delete this?");
      if (ok) {
        const newTodos = { ...todos };
        delete newTodos[key];
        setTodos(newTodos);
        saveTodos(newTodos);
      }
    } else {
      Alert.alert("Delete Todo", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => {
            const newTodos = { ...todos };
            delete newTodos[key];
            setTodos(newTodos);
            saveTodos(newTodos);
          },
        },
      ]);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text
            onPress={work}
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.gray4,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={play}
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: !working ? "white" : theme.gray4,
            }}
          >
            Play
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
          placeholderTextColor={theme.gray3}
          style={styles.input}
        />
        <ScrollView>
          {Object.keys(todos).map((key) =>
            todos[key].working === working ? (
              <View style={styles.todo} key={key}>
                <Text style={styles.todoText}>{todos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="check" size={16} color={theme.gray3} />
                </TouchableOpacity>
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
  btnText: {},
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
    backgroundColor: theme.gray5,
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  todoText: { color: "white", fontSize: 16, fontWeight: "400" },
});
