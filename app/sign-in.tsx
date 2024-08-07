import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Mailjs from "@/constants/mail-tm";
import { useSession } from "@/contexts/AuthContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as AsyncStorage from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { ToastAndroid, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash = "LZFYvHWGE=WGb_afjYWC-,jeM_V]";

export default function SignIn() {
  const { signIn, session } = useSession();
  const api = new Mailjs();
  // useEffect(() => {
  //   const fetchDomains = async () => {
  //     const { data } = await api.getDomains();
  //     data.map(({ domain, id, isActive }) => {
  //       if (isActive) {
  //         setDomains((prevDomains) => [
  //           ...prevDomains,
  //           { label: domain, value: id },
  //         ]);
  //       }
  //     });
  //   };
  //   fetchDomains();
  // }, []);

  const handleClick = async () => {
    const req = await api.createOneAccount();
    if (!req) {
      ToastAndroid.show("Failed to create account", ToastAndroid.SHORT);
    } else {
      const {
        data: { token, id, address, username, password },
      } = req;

      signIn(token);
      AsyncStorage.setItem("account-id", id);
      AsyncStorage.setItem("account-token", token);
      AsyncStorage.setItem("account-address", address);
      AsyncStorage.setItem("account-username", username);
      AsyncStorage.setItem("account-password", password);
      ToastAndroid.show("Account created successfully", ToastAndroid.SHORT);
      router.push("/(app)/(tabs)/");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      <ThemedView style={{ flex: 1 }}>
        <ThemedView>
          <ThemedView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
            }}
          >
            <Image
              style={{
                height: 60,
                width: "100%",
              }}
              source="https://docs.mail.tm/logo-white.svg"
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </ThemedView>
          <ThemedView
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Login
            </ThemedText>
          </ThemedView>
          {/* <ThemedView
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          style={{
            inputAndroid: {
              color: "white",
            },
            placeholder: {
              color: "white",
            },
          }}
          placeholder={{ label: "Choose a domain" }}
          Icon={() => <Entypo name="chevron-down" size={24} color="white" />}
          items={domains}
        />
      </ThemedView> */}
          <TouchableOpacity
            style={{
              padding: 20,
            }}
            onPress={handleClick}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{
                color: "white",
                alignItems: "center",
                padding: 10,
                justifyContent: "center",
                textAlign: "center",
                borderColor: "yellow",
                borderWidth: 2,
                borderRadius: 10,
                backgroundColor: "blue",
              }}
            >
              Sign In
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
