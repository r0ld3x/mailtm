import { ThemedView } from "@/components/ThemedView";
import Mailjs from "@/constants/mail-tm";
import { useSession } from "@/contexts/AuthContext";
import { MailTmProvider } from "@/contexts/MailTmContext";
import { useGetAccount } from "@/hooks/useGetAccount";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

const globalForMailjs = global as unknown as { mailtm: Mailjs };

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { data: id, isLoading: isLoadingId } = useGetAccount("id");
  useEffect(() => {}, [id, session]);
  if (isLoading || isLoadingId) {
    return <Text>Loading...</Text>;
  }
  if (!session || id === undefined || id === null) {
    return <Redirect href="/sign-in" />;
  }

  const mailtm = globalForMailjs.mailtm || new Mailjs(session, id);
  if (process.env.NODE_ENV !== "production") globalForMailjs.mailtm = mailtm;

  return (
    <MailTmProvider mailtm={mailtm}>
      <ThemedView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemedView>
    </MailTmProvider>
  );
}
