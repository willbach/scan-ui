import { PatpNoSig } from "@urbit/http-api";

declare global {
  interface Window {
    ship: PatpNoSig;
    desk: string;
  }
}
