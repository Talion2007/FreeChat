import ChatBox from "../components/ChatBox";

export default function ChatScreen({ route }) {
    const { partner } = route.params;
    return <ChatBox partner={partner} />;
}
