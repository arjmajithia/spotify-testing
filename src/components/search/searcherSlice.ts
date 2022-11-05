import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

interface searcherState {
	tracks: Object,
	artists: Object,
	albums: Object, 
	playlists: Object,
}

const initialState: searcherState  = {
	tracks: {},
	artists: {},
	albums: {},
	playlists: {},
}

export const searcherSlice = createSlice({
	name: 'searcher',
	initialState,
	reducers: {
		setTracks: (state, action: PayloadAction<string>) => {
			state.tracks = action.payload;
		},
		setArtists: (state, action: PayloadAction<string>) => {
			state.artists = action.payload;
		},
		setAlbums: (state, action: PayloadAction<string>) => {
			state.albums = action.payload;
		},
		setPlaylists: (state, action: PayloadAction<Object>) => {
			state.playlists = action.payload;
		},
	},
});

export const { setTracks, setArtists, setAlbums, setPlaylists } = searcherSlice.actions;

export const selectTracks = (state: RootState) => state.searcher.tracks;
export const selectArtists = (state: RootState) => state.searcher.artists;
export const selectAlbums = (state: RootState) => state.searcher.albums;
export const selectPlaylists = (state: RootState) => state.searcher.playlists;

export const setSearchAsync = (accessToken: string, search: string, filters: string): AppThunk => dispatch => {
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch(`https://api.spotify.com/v1/search/q=${search}&type=${filters}`, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		console.log(data); 
		dispatch(setTracks(data.tracks ? data.tracks : {})); 
		dispatch(setArtists(data.artists ? data.artists : {})); 
		dispatch(setAlbums(data.albums ? data.albums : {})); 
		dispatch(setPlaylists(data.playlists ? data.playlists : {})); 
	}).catch((error) => {
		console.log(error); 
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default searcherSlice.reducer;
