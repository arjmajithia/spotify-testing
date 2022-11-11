import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../authorization/authorizationSlice';

/** need all the variables that fetch returns, initialize to nothing */
interface categoriesState {
	categories: Object,
}

const initialState: categoriesState  = {
	categories: {},
}

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<string>) => {
			state.categories = action.payload;
			console.log(state.categories);
		},
	},
});

/** want to be able to return slice actions and data */
export const { setCategories } = categoriesSlice.actions;
export const selectCategories = (state: RootState) => state.categories.categories;

/** want authorization token, search query, and filters to pass into api query  */
export const setCategoriesAsync = (accessToken: string, id: string = "", url: string = ""): AppThunk => dispatch => {
	/** add access token and query search with GET  */
	const myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer '+ accessToken);
	let queryURL = '';

	if(id === ""){
		if(url !== ""){
			queryURL = `https://api.spotify.com/v1/browse/categories` + url;
		} else {
			queryURL = `https://api.spotify.com/v1/browse/categories`;
		}
	} else {
		queryURL = `https://api.spotify.com/v1/browse/categories/${id}`;
	}

	fetch(queryURL, {
		method: 'GET',
		headers: myHeaders,
	}).then(response => response.json()).then((data) => {
		/** add returned data to state  */
		dispatch(setCategories(data.categories ? data.categories : data)); 
	}).catch((error) => {
		console.log(error); 
		/** 401 is bad token, reauthorization needed  */
		if (error instanceof XMLHttpRequest) { if (error.status === 401) { dispatch(setLoggedIn(false)); } }
	});
};

export default categoriesSlice.reducer;
