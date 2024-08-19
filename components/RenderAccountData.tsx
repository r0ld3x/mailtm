import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TextInput } from "react-native";
interface RenderInfoProps {
  name: string;
  value: string | number | undefined;
}

export default function RenderAccountData({ value, name }: RenderInfoProps) {
  return (
    <ThemedView style={styles.items}>
      <ThemedText style={styles.text}>{name}:</ThemedText>
      <TextInput
        selectTextOnFocus={true}
        style={styles.textInput}
        placeholder={name}
        placeholderTextColor="white"
        secureTextEntry={false}
        value={value ? value.toString() : "loading"}
        editable={false}
      />
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
