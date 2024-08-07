import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMainTmApi } from "@/contexts/MailTmContext";
import { useGetAccount } from "@/hooks/useGetAccount";
import { IRegisterResult } from "@/types/mail-tm-type";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import { useSession } from "../../../contexts/AuthContext";

export default function TabTwoScreen() {
  const { api } = useMainTmApi();
  const { signOut } = useSession();
  const [account, setAccount] = useState<IRegisterResult | null>(null);

  const { data: password, isLoading } = useGetAccount("password");

  useEffect(() => {
    const fetchData = async () => {
      const messages = await api.me();
      if (!messages.data) return;
      setAccount(messages.data);
    };

    fetchData();
  }, []);

  return (
    <ThemedView style={{ flex: 1, paddingTop: 10 }}>
      <ThemedView style={{ flex: 1, paddingHorizontal: 20, gap: 10 }}>
        <ThemedView style={styles.items}>
          <ThemedText style={styles.text}>Id:</ThemedText>
          <TextInput
            selectTextOnFocus={true}
            style={styles.textInput}
            placeholder="Enter text here"
            placeholderTextColor="white"
            secureTextEntry={false}
            value={account ? account.id : "loading"}
            editable={false}
          />
        </ThemedView>
        <ThemedView style={styles.items}>
          <ThemedText style={styles.text}>Address:</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text here"
            placeholderTextColor="white"
            secureTextEntry={false}
            value={account ? account.address : "loading"}
            editable={false}
          />
        </ThemedView>
        <ThemedView style={styles.items}>
          <ThemedText style={styles.text}>Password:</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text here"
            placeholderTextColor="white"
            secureTextEntry={false}
            value={isLoading ? "loading" : password ?? ""}
            editable={false}
          />
        </ThemedView>
        <ThemedView style={styles.items}>
          <ThemedText style={styles.text}>Created At:</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text here"
            placeholderTextColor="white"
            secureTextEntry={false}
            value={
              account ? new Date(account.createdAt).toUTCString() : "loading"
            }
            editable={false}
          />
        </ThemedView>
        <ThemedView
          style={{
            gap: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText style={styles.text}>Used Quota:</ThemedText>
          <ThemedText>
            <Progress.Bar
              progress={account ? (account.used / account.quota) * 100 : 0}
              width={50}
            />
          </ThemedText>
          {account && (
            <ThemedText>
              {account.used} / {account.quota}
            </ThemedText>
          )}
        </ThemedView>
        <ThemedView>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
            <ThemedText style={{ alignSelf: "center", fontSize: 18 }}>
              Logout
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <ThemedView
        style={{
          marginTop: "auto",
          paddingBottom: 20,
          alignItems: "center",
          width: "100%",
        }}
      >
        <ThemedText>
          This app is made with ❤️ by{" "}
          <Link href={"https://roldex.xyz/"}>
            <ThemedText style={{}} type="link">
              Roldex
            </ThemedText>
          </Link>
        </ThemedText>
        <ThemedText>
          Source code is available{" "}
          <Link href={"https://github.com/r0ld3x/mailtm"}>
            <ThemedText style={{}} type="link">
              Here
            </ThemedText>
          </Link>
        </ThemedText>
        <ThemedText>
          Special Thanks to{" "}
          <Link href={"https://mail.tm"}>
            <ThemedText style={{}} type="link">
              Mail.tm
            </ThemedText>
          </Link>{" "}
          For the api and the service.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  items: {
    gap: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  textInput: {
    width: "auto",
    padding: 15,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    fontSize: 16,
    color: "white",
  },
});
