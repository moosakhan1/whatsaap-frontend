import { createSlice } from "@reduxjs/toolkit";

export const setActiveCallSlice = createSlice({
  name: "activeCall",
  initialState: {
    activeCall: null,
  },
  reducers: {
    setActiveCall: (state, action) => {
      state.activeCall = {
        id: action.payload.id,
        messageId: action.payload.messageId,
        blocked: action.payload.blocked,
        personOne: action.payload.personOne,
        personTwo: action.payload.personTwo,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
    },

    clearActiveCall: (state) => {
      state.activeCall = null;
    },
  },
});

export const { clearActiveCall, setActiveCall } = setActiveCallSlice.actions;

export default setActiveCallSlice.reducer;
