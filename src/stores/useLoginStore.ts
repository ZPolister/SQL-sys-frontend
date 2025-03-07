import {create} from "zustand/react";


export interface LoginStoreState {
  state: "pending" | "logged" | "logout"
}

export interface LoginStoreAction {
  setState: (state: LoginStoreState["state"]) => void
}

export const useLoginStore = create<LoginStoreState & LoginStoreAction>(
  (set) => ({
    state: "pending",

    setState: (state) => set({state})
  })
)
