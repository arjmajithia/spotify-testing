import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

/** need all the variables that fetch returns, initialize to nothing */
interface userInfoState {
	displayName: string,
	type: string,
	uri: string,
	followers: Object,
}

const initialState: userInfoState = {
	displayName: '',
	type: '',
	uri: '',
	followers: {},
}

/** set state values from data returned as reducers */
export const userInfoSlice = createSlice({
	name: 'userinfo',
	initialState,
	reducers: {
		setDisplayName: (state, action: PayloadAction<string>) => {
			state.displayName = action.payload;
		},
		setType: (state, action: PayloadAction<string>) => {
			state.type = action.payload;
		},
		setUri: (state, action: PayloadAction<string>) => {
			state.uri = action.payload;
		},
		setFollowers: (state, action: PayloadAction<Object>) => {
			state.followers = action.payload;
		},
	},
});

/** want to be able to return slice actions and data */
export const { setDisplayName, setType, setFollowers, setUri } = userInfoSlice.actions;
export const selectDisplayName = (state: RootState) => state.userinfo.displayName;
export const selectType = (state: RootState) => state.userinfo.type;
export const selectUri = (state: RootState) => state.userinfo.uri;
export const selectFollowers = (state: RootState) => state.userinfo.followers;

/** want authorization token, search query, and filters to pass into api query  */
export const checkProfileAsync  = (accessToken: string): AppThunk => dispatch => {
	/** add access token and query search with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken['access_token']);

	fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		/** add returned data to state  */
		dispatch(setDisplayName(data.display_name ? data.display_name : data.id)); 
		dispatch(setType(data.type ? data.type : data.id)); 
		dispatch(setUri(data.uri ? data.uri : data.id)); 
		dispatch(setFollowers(data.followers ? data.followers : data.id)); 
	}).catch((error) => {
		/** 401 is bad token, reauthorization needed  */
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default userInfoSlice.reducer;
