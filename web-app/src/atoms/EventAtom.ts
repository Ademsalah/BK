import { atom } from "jotai";
export const eventAtom = atom({
  title: "",
  description: "",
  date: "",
  location: "",
  totalBudget: 0,
  ticketPrice: 0,
  capacity: 0,
});


