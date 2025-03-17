import { createSlice } from "@reduxjs/toolkit";

export const selectChatSlice = createSlice({
  name: "selectChat",
  initialState: {
    selectedChat: null,
    status: "chats",
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = {
        id: action.payload.id,
        messageId: action.payload.messageId,
        blocked: action.payload.blocked,
        personOne: action.payload.personOne,
        personTwo: action.payload.personTwo,
        blockUserId: action.payload.blockUserId,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
    },
    updateBlock: (state, action) => {
      if (state.selectedChat) {
        state.selectedChat = {
          ...state.selectedChat,
          blocked: action.payload.blocked,
          blockUserId: action.payload.blockUserId,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateStatusChat: (state, action) => {
      state.status = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
  },
});

export const {
  setSelectedChat,
  clearSelectedChat,
  updateStatusChat,
  updateBlock,
} = selectChatSlice.actions;

export default selectChatSlice.reducer;
