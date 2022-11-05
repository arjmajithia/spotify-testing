import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

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

export const { setDisplayName, setType, setFollowers, setUri } = userInfoSlice.actions;

export const selectDisplayName = (state: RootState) => state.userinfo.displayName;
export const selectType = (state: RootState) => state.userinfo.type;
export const selectUri = (state: RootState) => state.userinfo.uri;
export const selectFollowers = (state: RootState) => state.userinfo.followers;

export const setUserProfileAsync = (accessToken: string): AppThunk => dispatch => {
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);

	fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		console.log(data); 
		dispatch(setDisplayName(data.display_name ? data.display_name : data.id)); 
		dispatch(setType(data.type ? data.type : data.id)); 
		dispatch(setUri(data.uri ? data.uri : data.id)); 
		dispatch(setFollowers(data.followers ? data.followers : data.id)); 
	}).catch((error) => {
		console.log(error); 
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default userInfoSlice.reducer;
