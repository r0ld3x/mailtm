import RenderAccountData from "@/components/RenderAccountData";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMainTmApi } from "@/contexts/MailTmContext";
import { useGetAccount } from "@/hooks/useGetAccount";
import { IRegisterResult } from "@/types/mail-tm-type";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import { useSession } from "../../../contexts/AuthContext";

function formatNumber(bytes: number): string {
  let formattedSize: string;

  if (bytes < 1_000) {
    // Less than 1 KB
    formattedSize = bytes + " B";
  } else if (bytes < 1_000_000) {
    // Less than 1 MB
    const kb = bytes / 1_000;
    formattedSize =
      kb % 1 === 0 ? `${kb.toFixed(0)} KB` : `${kb.toFixed(1)} KB`;
  } else if (bytes < 1_000_000_000) {
    // Less than 1 GB
    const mb = bytes / 1_000_000;
    formattedSize =
      mb % 1 === 0 ? `${mb.toFixed(0)} MB` : `${mb.toFixed(1)} MB`;
  } else {
    // 1 GB or more
    const gb = bytes / 1_000_000_000;
    formattedSize =
      gb % 1 === 0 ? `${gb.toFixed(0)} GB` : `${gb.toFixed(1)} GB`;
  }

  return formattedSize;
}

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
        <RenderAccountData name="Id" value={account?.id} />
        <RenderAccountData name="Address" value={account?.address} />
        <RenderAccountData
          name="Password"
          value={isLoading ? "loading" : password ?? ""}
        />
        <RenderAccountData
          name="Created At"
          value={
            account ? new Date(account.createdAt).toUTCString() : undefined
          }
        />

        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={styles.text}>Used Quota:</ThemedText>
          <ThemedView style={{ flex: 1, marginHorizontal: 10 }}>
            <Progress.Bar
              progress={account ? account.used / account.quota : 0}
              style={{ flex: 1 }}
            />
          </ThemedView>
          {account && (
            <ThemedText
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {formatNumber(account.used)}/{formatNumber(account.quota)}
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
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});
