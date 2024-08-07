import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMainTmApi } from "@/contexts/MailTmContext";
import { formatDate } from "@/helper/help";
import { IMessageResult } from "@/types/mail-tm-type";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";

const Message = () => {
  const local = useLocalSearchParams();
  const { api } = useMainTmApi();
  const msgId = local.msgId as string;
  const [message, setMessage] = React.useState<IMessageResult | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const messages = await api.getMessage(msgId);
      if (!messages.data) return;
      setMessage(messages.data);
      await api.setMessageSeen(msgId);
    };
    fetchData();
  }, []);

  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, padding: 10 }}>
        {message ? (
          <ThemedView>
            <ThemedView>
              <ThemedView style={style.header}>
                <ThemedText
                  style={{}}
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </ThemedText>

                <ThemedText
                  type="subtitle"
                  style={{ marginHorizontal: "auto" }}
                >
                  {message.subject}
                </ThemedText>
              </ThemedView>

              {/* Sender details section */}

              <ThemedView
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 10,
                  marginBottom: 5,
                  borderColor: "white",
                  marginTop: 5,
                  borderBottomWidth: 0.5,
                }}
              >
                <ThemedView style={style.senderInfo}>
                  <ThemedText type="subtitle">{message.from.name}</ThemedText>
                  <Link href={`mailto:${message.from.address}`}>
                    <ThemedText
                      style={{
                        textDecorationLine: "underline",
                        lineHeight: 10,
                        fontSize: 10,
                      }}
                    >
                      {message.from.address}
                    </ThemedText>
                  </Link>
                </ThemedView>
                <ThemedText style={{ marginBottom: 5 }}>
                  {formatDate(message.createdAt)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ScrollView>
              {message.html.length > 0 ? (
                message.html.map((html, i) => (
                  <ThemedView
                    key={i}
                    style={{
                      padding: 10,
                      marginBottom: i < message.html.length - 1 ? 10 : 0,
                      borderRadius: 5,
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    }}
                  >
                    <RenderHtml
                      contentWidth={width - 10}
                      source={{
                        html: html,
                      }}
                      baseStyle={{
                        color: "white",
                      }}
                    />
                  </ThemedView>
                ))
              ) : (
                <ThemedText>{message.text}</ThemedText>
              )}
            </ScrollView>
          </ThemedView>
        ) : (
          <ThemedView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default Message;

const style = StyleSheet.create({
  senderInfo: {
    paddingLeft: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    // paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "white",
  },
});
