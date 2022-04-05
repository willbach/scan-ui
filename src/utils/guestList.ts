import { Guest } from "../types/Guest"

export const sortGuests = (a: Guest, b: Guest) => {
  const diff = Number(a.confirmed) - Number(b.confirmed)

  if (diff === 0) {
    const size = a.ship.length - b.ship.length

    if (size === 0) {
      if (a.ship > b.ship) {
        return 1
      } else {
        return -1
      }
    }

    return size
  }
  return diff
}
