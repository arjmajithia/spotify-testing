import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

/** need all the variables that fetch returns, initialize to nothing */
interface searcherState {
	tracks: Object,
	artists: Object,
	albums: Object, 
	playlists: Object,
	show: Object,
	episode: Object,
	audiobook: Object,
}

const initialState: searcherState  = {
	tracks: {},
	artists: {},
	albums: {},
	playlists: {},
	show: {},
	episode: {},
	audiobook: {},
}

/** set state values from data returned as reducers */
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
		setShow: (state, action: PayloadAction<Object>) => {
			state.show = action.payload;
		},
		setEpisode: (state, action: PayloadAction<Object>) => {
			state.episode = action.payload;
		},
		setAudiobook: (state, action: PayloadAction<Object>) => {
			state.audiobook = action.payload;
		},
	},
});

/** want to be able to return slice actions and data */
export const { setTracks, setArtists, setAlbums, setPlaylists, setShow, setEpisode, setAudiobook } = searcherSlice.actions;
export const selectTracks = (state: RootState) => state.searcher.tracks;
export const selectArtists = (state: RootState) => state.searcher.artists;
export const selectAlbums = (state: RootState) => state.searcher.albums;
export const selectPlaylists = (state: RootState) => state.searcher.playlists;
export const selectShow = (state: RootState) => state.searcher.show;
export const selectEpisode = (state: RootState) => state.searcher.episode;
export const selectAudiobook = (state: RootState) => state.searcher.audiobook;

/** want authorization token, search query, and filters to pass into api query  */
export const setSearchAsync = (accessToken: string, URL: string): AppThunk => dispatch => {
	/** add access token and query search with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch(URL, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		/** add returned data to state  */
		dispatch(setTracks(data.tracks ? data.tracks : {})); 
		dispatch(setArtists(data.artists ? data.artists : {})); 
		dispatch(setAlbums(data.albums ? data.albums : {})); 
		dispatch(setPlaylists(data.playlists ? data.playlists : {})); 
		dispatch(setShow(data.shows ? data.shows : {})); 
		dispatch(setEpisode(data.episodes ? data.episodes : {})); 
		dispatch(setAudiobook(data.audiobooks ? data.audiobooks : {})); 
	}).catch((error) => {
		/** 401 is bad token, reauthorization needed  */
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export const refreshObjectAsync = (accessToken: string, URL: string, objectType: string): AppThunk => dispatch => {
	/** add access token and query new-releases with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	/** type of return */
	if(objectType === "playlist") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setPlaylists(data.playlists ? data.playlists : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
	if(objectType === "album") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setAlbums(data.albums ? data.albums : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
	if(objectType === "track") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setTracks(data.tracks ? data.tracks : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
	if(objectType === "artist") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setArtists(data.artists ? data.artists : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
	if(objectType === "episode") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setEpisode(data.episodes ? data.episodes : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
	if(objectType === "show") { 
		fetch(URL, {
			method: 'GET',
			headers: myHeaders,
		}).then(response => response.json()).then((data) => {
			/** add returned data to state  */
			dispatch(setShow(data.shows ? data.shows : {})); 
		}).catch((error) => {
			/** 401 is bad token, reauthorization needed  */
				if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
		});
	}
};

export default searcherSlice.reducer;
