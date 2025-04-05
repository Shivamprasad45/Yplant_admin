import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  URL: string;
}

const initialState: ImageState = {
  URL: "",
};

export const ImageSlice = createSlice({
  name: "Image",
  initialState,
  reducers: {
    setURL: (state, action: PayloadAction<string>) => {
      state.URL = action.payload;
    },
  },
});

export const { setURL } = ImageSlice.actions;
export const selectImageURL = (state: { Image: ImageState }) => state.Image.URL;
export default ImageSlice.reducer;
