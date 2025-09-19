import { View, StyleSheet, ScrollView } from "react-native";
import ChatList from "../components/ChatList";
import UserList from "../components/UserList";

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ChatList navigation={navigation} />
            <UserList navigation={navigation} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // importante para ScrollView ocupar toda a tela
        backgroundColor: "#fff",
        paddingVertical: 10,
    }
});
