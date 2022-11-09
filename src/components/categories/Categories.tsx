import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTracks, selectArtists, selectAlbums, selectPlaylists, setSearchAsync } from './categoriesSlice';
import styles from './Categories.module.css';
import { AppDispatch } from '../../app/store';
import { selectAccessToken } from '../authorization/authorizationSlice';

import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField } from '@material-ui/core';


export function Categories() {
	/** need states for search input and input change (searchName is current state) */
	const [searchName, setSearchName] = useState('');
	/** need states for filters (filter is array of current state: {"xyz": false, "abc":false, ...}) */
	const [filter, setFilters] = useState({ 
		album: false,
		artist: false,
		track: true,
		playlist: false,
		show: false,
		episode: false,
		audiobook: false,
	});
	/** easy way to edit filters on switch change */
	const checkboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilters({ ...filter, [event.target.name]: event.target.checked });
	};
	const dispatch = useDispatch<AppDispatch>();
	/** need access token for fetch as always */
	const accessToken = useSelector(selectAccessToken);

	/** NEED FOR SEARCH INPUT */
	/** parse filter state to string for easy reference and input to search */
	function FilterParse() {
		let output = '';
		for (const key in filter) {
			if(filter[key] && output){ output += ',' + key; }
			else if(filter[key] && !output){ output += key; }
		}
		return output;
	}
	/** search query! */
	function querySpotify(accessToken: string, search: string, filters: string) {
		console.log(accessToken);
		console.log(search);
		console.log(filters);
		dispatch(setSearchAsync(accessToken, search, filters));
	}

	return (
		<div>
		 <TextField label="Search a song" variant="outlined" onChange={(e) => setSearchName(e.target.value)}></TextField>
		 <br></br>
		 <br></br>
		 <FormGroup row>
		   <FormControlLabel control={<Switch checked={filter.track} onChange={checkboxChange} name="track" />} label="Songs" />
		   <FormControlLabel control={<Switch checked={filter.album} onChange={checkboxChange} name="album" />} label="Albums" />
		   <FormControlLabel control={<Switch checked={filter.artist} onChange={checkboxChange} name="artist" />} label="Artists" />
		   <FormControlLabel control={<Switch checked={filter.playlist} onChange={checkboxChange} name="playlist" />} label="Playlists" />
		   <FormControlLabel control={<Switch checked={filter.show} onChange={checkboxChange} name="show" />} label="Show" />

		  <FormControlLabel control={<Switch checked={filter.episode} onChange={checkboxChange} name="episode" />} label="Episodes" />
		  <FormControlLabel control={<Switch checked={filter.audiobook} onChange={checkboxChange} name="audiobook" />} label="Audiobooks" />
		 </FormGroup>
		 <br></br>
		 <br></br>
		 <p>{FilterParse()}</p>
		  <Button variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, searchName, FilterParse())}><Typography>get song</Typography></Button>
		</div>
	);
}
