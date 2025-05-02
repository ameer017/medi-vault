import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { data } from "@/data/todos";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => a.id - b.id));
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
      setTodos([...todos, { id: newId, title: text, completed: false }]);
      setText("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const renderItem = ({ item }: { item: Todo }) => {
    return (
      <View style={styles.todoItem}>
        <Text
          style={[styles.todoText, item.completed && styles.completedText]}
          onPress={() => toggleTodo(item.id)}
        >
          {item.title}
        </Text>
        <Pressable onPress={() => removeTodo(item.id)}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={36}
            color="red"
            selectable={undefined}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </Pressable>
      </View>{" "}

      <FlatList<Todo>
  data={todos}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ flexGrow: 1 }}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 18,
    minWidth: 0,
    color: "white",
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: "black",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "white",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
