import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

interface featuredState {
	featplaylist: Object,
}

const initialState: featuredState  = {
	featplaylist: {},
}

export const featuredSlice = createSlice({
	name: 'featured',
	initialState,
	reducers: {
		setFeatPlaylist: (state, action: PayloadAction<string>) => {
			state.featplaylist = action.payload;
			console.log(state.featplaylist);
		},
	},
});

export const { setFeatPlaylist } = featuredSlice.actions;

export const selectFeatPlaylist = (state: RootState) => state.featured.featplaylist;

export const featPlaylistAsync = (accessToken: string): AppThunk => dispatch => {
	console.log(accessToken);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch(`https://api.spotify.com/v1/browse/featured-playlists`, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		console.log(data); 
		dispatch(setFeatPlaylist(data.playlists ? data.playlists : {})); 
	}).catch((error) => {
		console.log(error); 
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default featuredSlice.reducer;
