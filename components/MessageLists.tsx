import { formatDate } from "@/helper/help";
import { IMessagesResult } from "@/types/mail-tm-type";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const MessageLists = ({ message }: { message: IMessagesResult }) => {
  const onClick = () => {
    router.push(`/message?msgId=${message.id}`);
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <ThemedView style={styles.container}>
        {/* Logo Section */}
        <ThemedView style={styles.logoContainer}>
          <ThemedText type="defaultSemiBold" style={styles.logoText}>
            {message.from.name.at(0)}
          </ThemedText>
        </ThemedView>

        {/* Message Subject Section */}
        <ThemedView style={styles.messageContainer}>
          <ThemedText
            type="default"
            style={styles.messageText}
            numberOfLines={1}
          >
            {message.subject}
          </ThemedText>
          <ThemedText
            type="default"
            style={styles.messageSubTitleText}
            numberOfLines={1}
          >
            {message.intro}
          </ThemedText>
        </ThemedView>
        {/* Date and Status Section */}
        <ThemedView style={styles.dateStatusContainer}>
          <ThemedText type="subtitle" style={styles.dateText}>
            {formatDate(message.createdAt)}
          </ThemedText>
          <ThemedText type="default">
            <FontAwesome6
              name="check-double"
              size={20}
              color={message.seen ? "green" : "white"}
            />
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.4,
    borderColor: "white",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 99999,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  messageContainer: {
    flex: 1,
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
  },
  messageSubTitleText: {
    fontSize: 12,
    color: "grey",
  },
  dateStatusContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dateText: {
    color: "grey",
    fontSize: 12,
  },
});

export default MessageLists;
