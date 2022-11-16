import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

/** need all the variables that fetch returns, initialize to nothing */
interface featuredState {
	featplaylist: Object,
}

const initialState: featuredState  = {
	featplaylist: {},
}

/** set state values from data returned as reducers */
export const featuredSlice = createSlice({
	name: 'featured',
	initialState,
	reducers: {
		setFeatPlaylist: (state, action: PayloadAction<string>) => {
			state.featplaylist = action.payload;
		},
	},
});

/** want to be able to return slice actions and data */
export const { setFeatPlaylist } = featuredSlice.actions;
export const selectFeatPlaylist = (state: RootState) => state.featured.featplaylist;

/** want authorization token, search query, and filters to pass into api query  */
export const featPlaylistAsync = (accessToken: string, getURL: string): AppThunk => dispatch => {
	/** add access token and query search with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch(getURL, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		/** add returned data to state  */
		dispatch(setFeatPlaylist(data.playlists ? data.playlists : {})); 
	}).catch((error) => {
		/** 401 is bad token, reauthorization needed  */
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default featuredSlice.reducer;
