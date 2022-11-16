import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

/** only need one return since Spotify only returns one type, initialize it to nothing  */
interface newreleasesState {
	newreleases: Object,
}

const initialState: newreleasesState  = {
	newreleases: {},
}

export const newreleasesSlice = createSlice({
	name: 'newrelease',
	initialState,
	reducers: {
		setNewReleases: (state, action: PayloadAction<string>) => {
			state.newreleases = action.payload;
		},
	},
});

/** we want to be able to return slice actions and data  */
export const { setNewReleases } = newreleasesSlice.actions;
export const selectNewReleases = (state: RootState) => state.newrelease.newreleases;

export const newReleasesAsync = (accessToken: string, URL: string): AppThunk => dispatch => {
	/** add access token and query new-releases with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch(URL, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		/** add returned data to state  */
		dispatch(setNewReleases(data.albums ? data.albums : {})); 
	}).catch((error) => {
		/** 401 is bad token, reauthorization needed  */
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default newreleasesSlice.reducer;
