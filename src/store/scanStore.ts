import create from "zustand"
import { SubscriptionRequestInterface } from "@urbit/http-api";
import api from "../api";
import { Guest } from "../types/Guest";
import { sortGuests } from "../utils/guestList";

interface CodeData {
  code: number
  expires_at: string
}

export interface ScanStore {
  code: number | null,
  expiresAt: Date | null,
  guestList: Guest[],
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
  // TODO: err, quit handling (resubscribe?)
  return request;
}

// '~2022.4.4..22.45.04..b1b8'
// const d = new Date("2015-03-25T12:00:00Z");
const parseExpiresAt = (eA: string) => eA
  .replace('~', '')
  .replace(/\.[0-9]+?/, m => `-${m.length === 2 ? `0${m[1]}` : m.slice(0)}`)
  .replace(/\.[0-9]+?/, m => `-${m.length === 2 ? `0${m[1]}` : m.slice(0)}`)
  .replace('..', 'T')
  .replace('.', ':')
  .replace('.', ':')
  .replace(/\.\..*$/, 'Z')

const useScanStore = create<ScanStore>((set, get) => ({
  code: null,
  expiresAt: null,
  guestList: [],
  init: async () => {
    const handleSignerUpdate = ({ code, expires_at }: CodeData) => {
      const expiresAt = new Date(parseExpiresAt(expires_at))
      set({ code, expiresAt })
    }
    const handleGuestListUpdate = (data: { [key: string]: boolean }) => {
      const guestList = Object.keys(data)
        .map((ship) => ({ ship, confirmed: data[ship] }))
        .sort(sortGuests)
      set({ guestList })
    }

    api.subscribe(createSubscription('scan', '/signer-updates', handleSignerUpdate))
    api.subscribe(createSubscription('scan', '/reader-updates', handleGuestListUpdate))

    get().createCode()
  },
  createCode: async () => {
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
      json: { verify: { code } }
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
    if (window.confirm('Are you sure you want to clear the list?')) {
      await api.poke({
        app: 'scan',
        mark: 'action',
        json: { 'clear-guests': true }
      })
    }
  },
}));

export default useScanStore;
