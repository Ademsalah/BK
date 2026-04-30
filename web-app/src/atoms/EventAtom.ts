import { atom } from "jotai";
export const eventAtom = atom({
  id: null,
  title: "",
  description: "",
  date: "",
  location: "",
  totalBudget: 0,
  ticketPrice: 0,
  capacity: 0,
});


