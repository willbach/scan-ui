import create from "zustand"
import { SubscriptionRequestInterface } from "@urbit/http-api";
import api from "../api";
import { Guest } from "../types/Guest";
import { sortGuests } from "../utils/guestList";

interface CodeData {
  code: string
  expires_at: string
}

export interface ScanStore {
  loading: boolean
  code: string | null,
  expiresAt: Date | null,
  guestList: Guest[],
  guestSuccess?: string,
  palsPopupShip: string,
  showPalsPopup: boolean,
  setLoading: (loading: boolean) => void,
  init: () => Promise<void>,
  createCode: () => Promise<void>,
  verifyCode: (code: string) => Promise<void>,
  setGuestList: (guestList: string[]) => Promise<void>,
  setGuestSuccess: (guestSuccess?: string) => void,
  clearGuestList: () => Promise<void>,
  addPal: (ship: string, tags: string[]) => Promise<void>,
  setPalsPopupShip: (palsPopupShip?: string) => void,
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
  .replace(/\.[0-9]+/, m => `-${m.length === 2 ? `0${m[1]}` : m.slice(1)}`)
  .replace(/\.[0-9]+/, m => `-${m.length === 2 ? `0${m[1]}` : m.slice(1)}`)
  .replace('..', 'T')
  .replace('.', ':')
  .replace('.', ':')
  .replace(/\.\..*$/, 'Z')

const useScanStore = create<ScanStore>((set, get) => ({
  loading: true,
  code: null,
  expiresAt: null,
  guestList: [],
  palsPopupShip: '',
  showPalsPopup: false,
  setLoading: (loading) => set({ loading }),
  init: async () => {
    const handleSignerUpdate = ({ code, expires_at }: CodeData) => {
      const expiresAt = new Date(parseExpiresAt(expires_at))
      set({ code, expiresAt })
    }
    const handleGuestListUpdate = (data: { [key: string]: boolean }) => {
      const existingList = get().guestList
      const guestList = Object.keys(data)
        .map((ship) => ({ ship, confirmed: data[ship] }))
        .sort(sortGuests)

      const shipIsGuest = Boolean(guestList.find(({ ship, confirmed }) => existingList.find(e => e.ship === ship)))

      if (shipIsGuest) {
        const { ship } = (guestList.find(({ ship, confirmed }) => existingList.find(e => e.ship === ship && confirmed !== e.confirmed)) || { ship: '' })
        const guestSuccess = ship ? `${ship} confirmed!` : 'Already confirmed'
        set({ guestList, guestSuccess })
      } else if (Object.keys(data)[0]) {
        set({ palsPopupShip: Object.keys(data)[0], showPalsPopup: true })
      }
    }

    api.subscribe(createSubscription('scan', '/signer-updates', handleSignerUpdate))
    api.subscribe(createSubscription('scan', '/reader-updates', handleGuestListUpdate))

    get().createCode()
    set({ loading: false, palsPopupShip: '~nev', showPalsPopup: true })
  },
  createCode: async () => {
    set({ loading: true })
    await api.poke({
      app: 'scan',
      mark: 'action',
      json: { create: true }
    })
    setTimeout(() => set({ loading: false }), 1000)
  },
  verifyCode: async (code: string) => {
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
  setGuestSuccess: (guestSuccess?: string) => {
    set({ guestSuccess })
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
  addPal: async (ship: string, tags = []) => {
    await api.poke({
      app: 'pals',
      mark: 'pals-command',
      json: {
        meet: { ship, in: tags }
      }
    });
  },
  setPalsPopupShip: (palsPopupShip?: string) => {
    if (palsPopupShip) {
      set({ palsPopupShip, showPalsPopup: true })
    } else {
      set({ showPalsPopup: false })
    }
  },
}));

export default useScanStore;
