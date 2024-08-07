import Mailjs from "@/constants/mail-tm";
import { createContext, useContext, type PropsWithChildren } from "react";
interface MailTmContextTypes {
  api: Mailjs | null;
}
const MailTmContext = createContext<MailTmContextTypes>({
  api: null,
});

export function useMainTmApi() {
  const { api } = useContext(MailTmContext);

  if (process.env.NODE_ENV !== "production") {
    if (api === null) {
      throw new Error(
        "useMainTmApi must be used within a MailTmProvider with a valid API instance"
      );
    }
  }
  if (api === null) {
    throw new Error("API instance is not available");
  }

  return { api };
}

interface MailTmProviderProps extends PropsWithChildren {
  mailtm: Mailjs;
}

export function MailTmProvider({ children, mailtm }: MailTmProviderProps) {
  return (
    <MailTmContext.Provider value={{ api: mailtm }}>
      <>{children}</>
    </MailTmContext.Provider>
  );
}
