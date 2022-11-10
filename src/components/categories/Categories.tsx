import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoriesAsync } from './categoriesSlice';
import { AppDispatch } from '../../app/store';
import { selectAccessToken, selectIsLoggedIn } from '../authorization/authorizationSlice';

import styles from './Categories.module.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';


export function Categories() {
	/** need states for category id if added */
	const [categoryid, setCategoryid] = useState('');

	const dispatch = useDispatch<AppDispatch>();
	/** need access token for fetch as always, and isLogged to toggle button */
	const accessToken = useSelector(selectAccessToken);
	const isLoggedIn = useSelector(selectIsLoggedIn);

	/** search query! */
	function querySpotify(accessToken: string, id: string) {
		console.log(id);
		dispatch(setCategoriesAsync(accessToken, id));
	}

	return (
		<div>
		 {isLoggedIn && <TextField label="Search a category ID" variant="outlined" onChange={(e) => setCategoryid(e.target.value)}></TextField>}
		 <br></br>
		 <br></br>
		 {isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, categoryid)}><Typography>get song</Typography></Button>}
		</div>
	);
}
