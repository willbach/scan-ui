import create from "zustand"
import { SubscriptionRequestInterface } from "@urbit/http-api";
import api from "../api";

export interface ScanStore {
  code: number | null,
  expiration: Date | null,
  init: () => Promise<void>,
  createCode: () => Promise<void>,
  verifyCode: (code: number) => Promise<void>,
  setGuestList: (guestList: string[]) => Promise<void>,
  clearGuestList: () => Promise<void>,
}

export function createSubscription(app: string, path: string, e: (data: any) => void): SubscriptionRequestInterface {
  const request = {
    app,
    path,
    event: e,
    err: () => console.warn('SUBSCRIPTION ERROR'),
    quit: () => {
      throw new Error('subscription clogged');
    }
  };
  console.log('HELLo')
  // TODO: err, quit handling (resubscribe?)
  return request;
}

const useScanStore = create<ScanStore>((set, get) => ({
  code: null,
  expiration: null,
  init: async () => {
    const handleSignerUpdate = (data: any) => console.log('SIGNER UPDATE:', data)
    const handleGuestListUpdate = (data: any) => console.log('GUEST LIST UPDATE:', data)

    api.subscribe(createSubscription('scan', '/signer-updates', handleSignerUpdate))
    api.subscribe(createSubscription('scan', '/reader-updates', handleGuestListUpdate))

    get().createCode()
  },
  createCode: async () => {
    console.log('CREATE')
    await api.poke({
      app: 'scan',
      mark: 'action',
      json: { create: true }
    })
  },
  verifyCode: async (code: number) => {
    await api.poke({
      app: 'scan',
      mark: 'action',
      json: { verify: code }
    })
  },
  setGuestList: async (guestList: string[]) => {
    await api.poke({
      app: 'scan',
      mark: 'action',
      json: { 'set-guests': guestList }
    })
  },
  clearGuestList: async () => {
    await api.poke({
      app: 'scan',
      mark: 'action',
      json: { 'clear-guests': true }
    })
  },
}));

export default useScanStore;
