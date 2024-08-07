import MessageLists from "@/components/MessageLists";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMainTmApi } from "@/contexts/MailTmContext";
import { IMessagesResult } from "@/types/mail-tm-type";

import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const { api } = useMainTmApi();
  const [messages, setMessages] = useState<IMessagesResult[] | []>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    fetchMesages();
  }, []);

  const fetchMesages = useCallback(() => {
    const fetchData = async () => {
      const messages = await api.getMessages(1);
      if (!messages.data) return;
      setMessages(messages.data);
      setRefreshing(false);
    };

    fetchData();
  }, []);

  api.on("arrive", (msg) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: msg.subject,
        body: msg.intro,
        data: {
          messsageId: msg.id,
          screen: "/message",
        },
      },
      trigger: null,
    });
    console.log(msg);
  });

  // api.on("error", (err) => console.log(err));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMessages([]);
    fetchMesages();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: messages.length > 0 ? 0 : 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageLists message={message} key={message.id} />
          ))
        ) : refreshing ? (
          <ThemedView style={styles.container}>
            <ThemedText>Loading...</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.container}>
            <ThemedText
              type="defaultSemiBold"
              style={{ letterSpacing: 1.2, marginBottom: 5 }}
            >
              No messages yet.
            </ThemedText>
            <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
              <ThemedText>Refresh</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "white",
    marginBottom: 5,
    marginTop: 5,
    cursor: "pointer",
  },
  refreshBtn: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "blue",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});
