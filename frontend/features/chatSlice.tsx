import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface Channel {
  name: string;
  type: string;
  password: string;
}

interface InitialState {
  createNewChannel: boolean;
  channels: Channel[];
  channel: Channel;
}

const initialState: InitialState = {
  createNewChannel: false,
  channels: [],
  channel: {
    name: "",
    password: "",
    type: "",
  },
};

export const createChannel = createAsyncThunk(
  "channels/fetchChannelContent",
  async ({ name, password, type }: Channel, _api) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/channels/create`,
        {
          name,
          type,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return _api.fulfillWithValue(response.data);
    } catch (error) {
      return _api.rejectWithValue(error);
    }
  }
);

// export const getChannelsList = createAsyncThunk(
//   "channels/fetchChannelContent",
//   async (_, _api) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/channels/create`,
//         {
//           headers: {
//             authorization: `Bearer ${Cookies.get("accessToken")}`,
//           },
//         }
//       );
//       return _api.fulfillWithValue(response.data);
//     } catch (error) {
//       return _api.rejectWithValue(error);
//     }
//   }
// );

// const fetchChannelContent = createAsyncThunk(
//   "channels/fetchChannelContent",
//   async (channelId: number, _api) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/channels/${channelId}`
//       );
//       return _api.fulfillWithValue(response.data);
//     } catch (error) {
//       return _api.rejectWithValue(error);
//     }
//   }
// );

const channelsManagmentSlice = createSlice({
  name: "channelsManagment",
  initialState,
  reducers: {
    setNewChannelModal: (
      state: InitialState = initialState,
      action: PayloadAction<boolean>
    ) => {
      state.createNewChannel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChannel.fulfilled, (state, action: any) => {
      state.channel = action.payload;
    });
  },
});

export const { setNewChannelModal } = channelsManagmentSlice.actions;

export default channelsManagmentSlice.reducer;

//TODO update channel (name, password, owners)
//TODO get channel messages
//TODO add message to channel
