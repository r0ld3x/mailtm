import * as AsyncStorage from "expo-secure-store";
import { useEffect, useState } from "react";

export function useGetAccount(
  item: "address" | "id" | "username" | "password"
) {
  const [data, setData] = useState<null | string>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const key = `account-${item}`;
        const storedData = await AsyncStorage.getItem(key);

        if (storedData !== null) {
          setData(storedData);
        } else {
          setData("");
        }
      } catch (error) {
        console.error("Failed to retrieve data from AsyncStorage:", error);
        setData(null);
      }
    };

    getData();
  }, [item]);

  return { data, isLoading: data === null };
}
