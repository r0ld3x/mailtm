import type * as type from "@/types/mail-tm-type";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import EventSource from "react-native-sse";

interface EventHandlers {
  arrive: (data: any) => void;
  seen: (data: any) => void;
  delete: (data: any) => void;
  error: (data: any) => void;
}
type EventType = keyof EventHandlers;

class Mailjs {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private baseMercure: string;
  private listener: EventSource<never> | null;
  private token: string;
  private events: Partial<EventHandlers> = {};
  id: string;
  address: string;

  constructor(token?: string, accountId?: string) {
    this.baseUrl = "https://api.mail.tm";
    this.baseMercure = "https://mercure.mail.tm/.well-known/mercure";
    this.listener = null;
    this.events = {};
    this.token = token ?? "";
    this.id = accountId ?? "";
    this.address = "";
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
      },
    });
  }

  // Account

  /** Creates an Account resource. */
  async register(
    address: string,
    password: string
  ): Promise<type.RegisterResult> {
    const data = { address, password };
    return this._send("/accounts", "POST", data);
  }

  /** Get an Account resource by its id. */
  async login(address: string, password: string): Promise<type.LoginResult> {
    const data = { address, password };
    const res = await this._send("/token", "POST", data);
    if (res.status) {
      this.token = res.data.token;
      this.id = res.data.id;
      this.address = address;
    }

    return res;
  }

  /** Login with user JWT token */
  async loginWithToken(): Promise<type.AccountResult> {
    if (this.token.length <= 0) {
      console.warn("token is empty");
    }

    const res = await this.me();

    if (!res.status) return res;

    this.id = res.data.id;
    this.address = res.data.address;

    return res;
  }

  /** Retrieves an Account resource. */
  async me(): Promise<type.AccountResult> {
    return this._send("/me");
  }

  /** Retrieves an Account resource. */
  async getAccount(accountId: string): Promise<type.AccountResult> {
    return this._send(`/accounts/${accountId}`);
  }

  /** Deletes the Account resource. */
  async deleteAccount(accountId: string): Promise<type.DeleteResult> {
    this.off();
    return this._send(`/accounts/${accountId}`, "DELETE");
  }

  /** Deletes the logged in account. */
  async deleteMe(): Promise<type.DeleteResult> {
    return this.deleteAccount(this.id);
  }

  // Domain

  /** Returns a list of domains. */
  async getDomains(): Promise<type.DomainListResult> {
    return this._send("/domains?page=1");
  }

  /** Retrieve a domain by its id. */
  async getDomain(domainId: string): Promise<type.DomainResult> {
    return this._send(`/domains/${domainId}`);
  }

  // Message

  /** Gets all the Message resources of a given page. */
  async getMessages(page = 1): Promise<type.MessageListResult> {
    return this._send(`/messages?page=${page}`);
  }

  /** Retrieves a Message resource with a specific id */
  async getMessage(messageId: string): Promise<type.MessageResult> {
    return this._send(`/messages/${messageId}`);
  }

  /** Deletes the Message resource. */
  async deleteMessage(messageId: string): Promise<type.DeleteResult> {
    return this._send(`/messages/${messageId}`, "DELETE");
  }

  /** Sets a message as read or unread. */
  async setMessageSeen(
    messageId: string,
    seen = true
  ): Promise<type.MessageResult> {
    return this._send(`/messages/${messageId}`, "PATCH", { seen });
  }

  // Source

  /** Gets a Message's Source resource */
  async getSource(sourceId: string): Promise<type.SourceResult> {
    return this._send(`/sources/${sourceId}`);
  }

  // Events

  /** Open an event listener to messages and error */
  on(
    event: "seen" | "delete" | "arrive" | "error" | "open",
    callback: type.MessageCallback | type.EmptyCallback | type.SSEErrorEvent
  ) {
    if (!EventSource) {
      console.error(
        "EventSourcePolyfill is required for this feature. https://github.com/cemalgnlts/Mailjs/#quickstart"
      );
      return;
    }

    // Checking if valid events.
    if (!["seen", "delete", "arrive", "error", "open"].includes(event)) {
      console.error("Unknown event name:", event);
      return;
    }

    if (!this.listener) {
      this.listener = new EventSource(
        `${this.baseMercure}?topic=/accounts/${this.id}`,
        {
          headers: {
            Authorization: "Bearer " + this.token,
          },
          debug: process.env.NODE_ENV !== "production" ? false : true,
        }
      );

      this.listener.addEventListener("message", (msg: any) => {
        const data = JSON.parse(msg.data);
        if (data["@type"] === "Account") return;

        let eventType: EventType = "arrive";
        if (data.isDeleted) eventType = "delete";
        else if (data.seen) eventType = "seen";

        this.events[eventType]?.(data);
      });

      this.listener.addEventListener("error", (err: any) => {
        console.error("ERROR: ", err);
        if (this.events.error) {
          this.events.error(err);
        }
      });

      this.listener.addEventListener("close", (err: any) => {
        console.warn("Connection closed: ", err);
        if (this.events.error) {
          this.events.error(err);
        }
      });

      // this.listener.addEventListener("open", () => console.log("OPEN"));
    }
    if (event !== "open") this.events[event] = callback as any;
  }

  /** Clears the events and safely closes event listener. */
  off() {
    if (this.listener) this.listener.close();

    this.events = {};
    this.listener = null;
  }

  // Helper

  /** Create random account. */
  async createOneAccount(): Promise<type.CreateOneAccountResult | false> {
    let domain: any = await this.getDomains();
    if (!domain.status) return domain;
    else domain = domain.data[0].domain;
    const username = `${this._makeHash(5)}@${domain}`;
    const password = this._makeHash(8);
    const registerRes = await this.register(username, password);
    if (!registerRes.status) return false;
    const loginRes = await this.login(username, password);

    if (!loginRes.status) return false;

    return {
      status: true,
      message: "ok",
      data: {
        username,
        password,
        token: loginRes.data.token,
        id: loginRes.data.id,
        address: registerRes.data.address,
      },
    };
  }

  /** @private */
  _makeHash(size: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const select = () =>
      charset.charAt(Math.floor(Math.random() * charset.length));

    return Array.from({ length: size }, select).join("");
  }

  /** @private */
  async _send(
    path: string,
    method: type.Methods = "GET",
    body?: object
  ): Promise<type.PromiseResult<any>> {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
      ...(method === "POST" || method === "PATCH"
        ? {
            "Content-Type":
              method === "PATCH"
                ? "application/merge-patch+json"
                : "application/json",
          }
        : {}),
    };

    try {
      const response: AxiosResponse<any> = await this.axiosInstance.request({
        url: path,
        method,
        headers,
        data: body,
      });

      return {
        status: response.status >= 200 && response.status < 300,
        message: response.statusText,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: false,
          message: error.response?.data.message || error.message,
          data: error.response?.data || {},
        };
      } else {
        return {
          status: false,
          message: "An unknown error occurred",
          data: {},
        };
      }
    }
  }
}

export default Mailjs;
