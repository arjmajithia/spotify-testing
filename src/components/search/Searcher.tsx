import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectTracks, 
		 selectArtists, 
		 selectAlbums, 
		 selectPlaylists, 
		 selectShow, 
		 selectEpisode, 
		 selectAudiobook,
		 setSearchAsync,
		 refreshObjectAsync } from './searcherSlice'; 
import styles from './Searcher.module.css';
import { AppDispatch } from '../../app/store';
import { selectAccessToken, selectIsLoggedIn } from '../authorization/authorizationSlice';

import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField } from '@material-ui/core';


export function Searcher() {
	/** need states for search input and input change (searchName is current state) */
	const [searchName, setSearchName] = useState('');

	/** states for the different nav bars (playlist has playlist only next/prev, so on) */
	const [playlistNav, setPlaylistNav] = useState(false);
	const [albumNav, setAlbumNav] = useState(false);
	const [trackNav, setTrackNav] = useState(false);
	const [artistNav, setArtistNav] = useState(false);
	const [showNav, setShowNav] = useState(false);
	const [episodeNav, setEpisodeNav] = useState(false);
	/** audiobooks dont work in my region. while data is retrieved, app still thinks audiobooks has data  */
	/** we are making sure to remove the error as soon as button is pressed (while data is fetched)  */
	const [showAError, setShowAError] = useState(false);
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
		/** set the boolean when the checkbox is checked ; we are already removing on search */
		if(event.target.name === "audiobook" && event.target.checked === true) { setShowAError(true); }
	};
	const dispatch = useDispatch<AppDispatch>();
	const accessToken = useSelector(selectAccessToken);
	const isLoggedIn = useSelector(selectIsLoggedIn);

	/** Initialize data (multiple types of return so multiple variables) */
	const tracks = useSelector(selectTracks);
	const artists = useSelector(selectArtists);
	const albums = useSelector(selectAlbums);
	const playlists = useSelector(selectPlaylists);
	const shows  = useSelector(selectShow);
	const episodes = useSelector(selectEpisode);
	const audiobooks = useSelector(selectAudiobook);

	/** DETAILS NEEDS TO BE DEFINED  */
	/** SINCE EACH TYPE HAS A DIFFERENT DETAIL INFO, SEPERATE __DETAIL() FUNCTIONS  */
	/** ISSUE IS THAT IF(__) { DETAILS = __DETAIL() } DOES NOT WORK WITH AN OPENDETAIL FUNC */
	/** SO NO OPENDETAIL FUNCTIONALITY [ :(  ]  */

	/** NEED FOR SEARCH INPUT */
	/** parse filter state to string for easy reference and input to search */
	function parseFilters() {
		let output = '';
		for (const key in filter) {
			if(filter[key] && output){ output += ',' + key; }
			else if(filter[key] && !output){ output += key; }
		}
		return output;
	}
	/** search query! */
	function querySpotify(accessToken: string, query: string, filters: string) {

		let errorContainer = document.getElementById("errorDiv");
		if(errorContainer?.childElementCount > 0){
			while(errorContainer?.firstChild){ errorContainer.removeChild(errorContainer.firstChild); }
			setShowAError(false);
		}

		if(query !== "") {
			const getURL = `https://api.spotify.com/v1/search?q=${query}&type=${filters}`;
			dispatch(setSearchAsync(accessToken, getURL));
		}
		else 
		{
			/** NOT ALLOWED TO SEARCH NOTHING. ALERT USER */
			document.getElementById("errorDiv")?.appendChild(
			parseError("queryError", "Empty Query","Cannot have empty query"));
			console.log("Cant have query empty");
		}
	}
	function refreshData(accessToken: string, getURL: string, objectType: string) {
		if(getURL !== "") {
			dispatch(refreshObjectAsync(accessToken, getURL, objectType));
		}	
	}

	
	function parseReturned(
		tracks: Object,
		artists: Object,
		albums: Object,
		playlists: Object,
		shows: Object,
		episodes: Object,
		audiobooks: Object) 
	{
		const container = document.getElementById("myDiv");
		if(Object.keys(tracks).length > 1) {
			if(trackNav) {
				container?.appendChild(parseTrack(tracks));
			}
		}
		if(Object.keys(artists).length > 1) { 
			if(artistNav) {
				container?.appendChild(parseArtist(artists));
			}
		}
		if(Object.keys(albums).length > 1) { 
			if(albumNav) {
				container?.appendChild(parsePlaylist(albums));
			}
		}
		if(Object.keys(playlists).length > 1) { 
			if(playlistNav) {
				container?.appendChild(parsePlaylist(playlists));
			}
		}
		if(Object.keys(shows).length > 1) { 
			if(showNav) {
				container?.appendChild(parseShow(shows));
			}
		}
		if(Object.keys(episodes).length > 1) { 
			if(episodeNav) {
				container?.appendChild(parseEpisode(episodes));
			}
		}
		if(Object.keys(audiobooks).length > 1) { 
			if((!document.getElementById("audiobookError") && showAError)){
			document.getElementById("errorDiv")?.appendChild(
					parseError(
						"audiobookError",
						"Error showing Audiobooks", 
						"Spotify API does not currently support audiobook query outside of the USA"
						));
			}
		}
	}

	function emptyDetail() {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		let summaryHTML = "";
		 summary.innerHTML = summaryHTML;		
		 details.insertAdjacentElement("afterbegin", summary);
		
		  return(details);
	}

	function artistDetail(item: Object, index: Number = NaN) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.insertAdjacentText("beforeend", "Followers: ");
		details.insertAdjacentHTML("beforeend", item[index]['followers']['total'].toString().concat("<br>"));

		details.insertAdjacentText("beforeend", "Popularity [0-100]: ");
		details.insertAdjacentHTML("beforeend", item[index]['popularity'].toString().concat("<br>"));

		details.insertAdjacentText("beforeend", "Genres: ");
		for (let i = 0; i < item[index]['genres'].length; i++) {
			if(item[index]['genres'].length - i < 2) {
			  details.insertAdjacentHTML("beforeend", item[index]['genres'][i].concat("<br>")); 
			} else {
			  details.insertAdjacentHTML("beforeend", item[index]['genres'][i].concat(", ")); 
			}
		}

		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "View on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function playlistDetail(item: Object, index: Number = NaN) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const playlistLink = document.createElement("a");
		let summaryHTML = "";
		if(index || index === 0) {
		   summaryHTML = item[index]['name'];
		   playlistLink.href = item[index]['external_urls']['spotify'];
		   playlistLink.innerHTML = "Open in Spotify<br>";
		} 
		 summary.innerHTML = summaryHTML;		
		 details.insertAdjacentHTML("beforeend", item[index]['description'].concat("<br>"));
		 details.insertAdjacentText("beforeend", "Owner: ");
		 details.insertAdjacentHTML("beforeend", item[index]['owner']['display_name'].concat("<br>"));
		 details.insertAdjacentHTML("beforeend", JSON.stringify(item[index]['tracks']['total']).concat(" tracks<br>"));
		 details.insertAdjacentElement("afterbegin", playlistLink);
		 details.insertAdjacentElement("afterbegin", summary);
		
		  return(details);
	}

	function ms2S(input: Number) {
		const output = Math.floor(input/60000) + (((input/1000)%60)/100);
		return output.toFixed(2).toString();
	}

	function trackDetail(item: Object, index: Number) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['album']['album_type'].concat("<br>");
		details.insertAdjacentText("beforeend", "Release: ");
		details.insertAdjacentHTML("beforeend", item[index]['album']['release_date'].concat("<br>"));

		details.insertAdjacentText("beforeend", "Length: ");
		details.insertAdjacentHTML("beforeend", ms2S(item[index]['duration_ms']).replace(".",":").concat("<br>"));

		details.insertAdjacentText("beforeend", "Artists: ");
		for (let i = 0; i < item[index]['artists'].length; i++) {
			if(item[index]['artists'].length - i < 2) {
			  details.insertAdjacentHTML("beforeend", 
			  `<a href=${item[index]['artists'][i]['external_urls']['spotify']}>`
			  .concat(item[index]['artists'][i]['name']).concat("</a><br>")); 
			} else {
			  details.insertAdjacentHTML("beforeend", 
			  `<a href=${item[index]['artists'][i]['external_urls']['spotify']}>`
			  .concat(item[index]['artists'][i]['name']).concat("</a>, ")); 
			}
		}

		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function showDetail(item: Object, index: Number) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['html_description'].concat("<br>");
		details.insertAdjacentText("beforeend", "Publisher: ");
		details.insertAdjacentHTML("beforeend", item[index]['publisher'].concat("<br>"));

		details.insertAdjacentText("beforeend", "Length: ");
		details.insertAdjacentHTML("beforeend", item[index]['total_episodes'].toString().concat("<br>"));

		details.insertAdjacentText("beforeend", "Languages: ");
		for (let i = 0; i < item[index]['languages'].length; i++) {
			if(item[index]['languages'].length - i < 2) {
			  details.insertAdjacentHTML("beforeend", item[index]['languages'][i].concat("<br>")); 
			} else {
			  details.insertAdjacentHTML("beforeend", item[index]['languages'][i].concat(", ")); 
			}
		}

		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function episodeDetail(item: Object, index: Number) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['html_description'].concat("<br>");
		details.insertAdjacentText("beforeend", "Release: ");
		details.insertAdjacentHTML("beforeend", item[index]['release_date'].concat("<br>"));

		details.insertAdjacentText("beforeend", "Length: ");
		details.insertAdjacentHTML("beforeend", ms2S(item[index]['duration_ms']).replace(".",":").concat("<br>"));

		details.insertAdjacentText("beforeend", "Languages: ");
		for (let i = 0; i < item[index]['languages'].length; i++) {
			if(item[index]['languages'].length - i < 2) {
			  details.insertAdjacentHTML("beforeend", item[index]['languages'][i].concat("<br>")); 
			} else {
			  details.insertAdjacentHTML("beforeend", item[index]['languages'][i].concat(", ")); 
			}
		}

		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function albumDetail(item: Object, index: Number) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['album_type'].concat("<br>");
		details.insertAdjacentText("beforeend", "Release: ");
		details.insertAdjacentHTML("beforeend", item[index]['release_date'].concat("<br>"));
		details.insertAdjacentHTML("beforeend", JSON.stringify(item[index]['total_tracks']).concat(" tracks<br>"));
		/** link to tracks? ===> send through tracks parser  */
		details.insertAdjacentText("beforeend", "Artists: ");
		for (let i = 0; i < item[index]['artists'].length; i++) {
			if(item[index]['artists'].length - i < 2) {
			  details.insertAdjacentHTML("beforeend", 
			  `<a href=${item[index]['artists'][i]['external_urls']['spotify']}>`
			  .concat(item[index]['artists'][i]['name']).concat("</a><br>")); 
			} else {
			  details.insertAdjacentHTML("beforeend", 
			  `<a href=${item[index]['artists'][i]['external_urls']['spotify']}>`
			  .concat(item[index]['artists'][i]['name']).concat("</a>, ")); 
			}
		}

		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function parseError(id: string, error: string, errorDetails: string) {
		let container = document.getElementById("errorDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const details = document.createElement("details");
		const summary = document.createElement("summary");
		summary.innerHTML = error.concat("<br>");
		details.innerHTML = errorDetails;
		details.insertAdjacentElement("afterbegin", summary);
		details.id = id;
		console.log(details);

		return(details);
	}

	/** ALBUM AND PLAYLIST HAVE SAME FRAMEWORK, DIFFERENT DETAILS  */
	/** ALBUM AND PLAYLIST: SAME PARSER DIFFERENT DETAILS */
	function parsePlaylist(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		if(objectType === "playlist" && !playlistNav) { 
			if(albumNav === true) { setAlbumNav(false); }
			if(trackNav === true) { setTrackNav(false); }
			if(artistNav === true) { setArtistNav(false); }
			if(episodeNav === true) { setEpisodeNav(false); }
			if(showNav === true) { setShowNav(false); }
			setPlaylistNav(true); 
		}
		if(objectType === "album" && !albumNav) { 
			if(playlistNav === true) { setPlaylistNav(false); }
			if(trackNav === true) { setTrackNav(false); }
			if(artistNav === true) { setArtistNav(false); }
			if(episodeNav === true) { setEpisodeNav(false); }
			if(showNav === true) { setShowNav(false); }
			setAlbumNav(true); 
		}

		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	
		if(object !== undefined && object) {
			const tblBody = document.createElement("tbody");
			let item = object['items'];
			if(item !== undefined) {
			  let tblRow = document.createElement("tr");
			  let details = emptyDetail();
			  for (let i = 0; i < item.length; i++){
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  const wrapper = document.createElement("td");
				  const image = document.createElement("img");
				  if(objectType === "playlist") { 
					  details = playlistDetail(item, i); 
				  }
				  else if(objectType === "album") { 
					  details = albumDetail(item, i); 
				  }
				  image.src = item[i]['images'][0]['url'];
				  image.alt = item[i]['name'];

				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  tblRow.appendChild(wrapper);
			 }
		} 
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
		}
	}

	function parseShow(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		if(objectType === "show" && !showNav) { 
			if(playlistNav === true) { setPlaylistNav(false); }
			if(albumNav === true) { setAlbumNav(false); }
			if(trackNav === true) { setTrackNav(false); }
			if(artistNav === true) { setArtistNav(false); }
			if(episodeNav === true) { setEpisodeNav(false); }
			setShowNav(true); 
		}

		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	
		if(object !== undefined && object) {
			const tblBody = document.createElement("tbody");
			let item = object['items'];
			if(item !== undefined) {
			  let tblRow = document.createElement("tr");
			  let details = emptyDetail();
			  for (let i = 0; i < item.length; i++){
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  const wrapper = document.createElement("td");
				  if(item[i]['images'][1] !== undefined) {
				   const image = document.createElement("img");
				   if(objectType === "show") { 
				       details = showDetail(item, i); 
				   }
				   image.src = item[i]['images'][1]['url'];
				   image.alt = item[i]['name'];

				   wrapper.appendChild(details);
				   wrapper.appendChild(image);

				   tblRow.appendChild(wrapper);
				  }
				  else {
					if(objectType === "show") { 
					    details = showDetail(item, i); 
					}
					wrapper.appendChild(details);
					tblRow.appendChild(wrapper);
				  }
			 }
		} 
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
		}
	}

	function parseEpisode(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		if(objectType === "episode" && !episodeNav) { 
			if(playlistNav === true) { setPlaylistNav(false); }
			if(albumNav === true) { setAlbumNav(false); }
			if(trackNav === true) { setTrackNav(false); }
			if(artistNav === true) { setArtistNav(false); }
			if(showNav === true) { setShowNav(false); }
			setEpisodeNav(true); 
		}

		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	
		if(object !== undefined && object) {
			const tblBody = document.createElement("tbody");
			let item = object['items'];
			if(item !== undefined) {
			  let tblRow = document.createElement("tr");
			  let details = emptyDetail();
			  for (let i = 0; i < item.length; i++){
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  const wrapper = document.createElement("td");
				  if(item[i]['images'][1] !== undefined) {
				   const image = document.createElement("img");
				   if(objectType === "episode") { 
				       details = episodeDetail(item, i); 
				   }
				   image.src = item[i]['images'][1]['url'];
				   image.alt = item[i]['name'];

				   wrapper.appendChild(details);
				   wrapper.appendChild(image);

				   tblRow.appendChild(wrapper);
				  }
				  else {
					if(objectType === "episode") { 
					    details = episodeDetail(item, i); 
					}
					wrapper.appendChild(details);
					tblRow.appendChild(wrapper);
				  }
			 }
		} 
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
		}
	}

	function parseArtist(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		if(objectType === "artist" && !artistNav) { 
			if(playlistNav === true) { setPlaylistNav(false); }
			if(albumNav === true) { setAlbumNav(false); }
			if(trackNav === true) { setTrackNav(false); }
			if(episodeNav === true) { setEpisodeNav(false); }
			if(showNav === true) { setShowNav(false); }
			setArtistNav(true); 
		}

		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	
		if(object !== undefined && object) {
			const tblBody = document.createElement("tbody");
			let item = object['items'];
			if(item !== undefined) {
			  let tblRow = document.createElement("tr");
			  let details = emptyDetail();
			  for (let i = 0; i < item.length; i++){
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  const wrapper = document.createElement("td");
				  if(item[i]['images'][1] !== undefined) {
				   const image = document.createElement("img");
				   if(objectType === "artist") { 
				       details = artistDetail(item, i); 
				   }
				   image.src = item[i]['images'][1]['url'];
				   image.alt = item[i]['name'];

				   wrapper.appendChild(details);
				   wrapper.appendChild(image);

				   tblRow.appendChild(wrapper);
				  }
				  else {
					if(objectType === "artist") { 
					    details = artistDetail(item, i); 
					}
					wrapper.appendChild(details);
					tblRow.appendChild(wrapper);
				  }
			 }
		} 
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
		}
	}

	function parseTrack(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		if(objectType === "track" && !trackNav) { 
			if(playlistNav === true) { setPlaylistNav(false); }
			if(showNav === true) { setShowNav(false); }
			if(artistNav === true) { setArtistNav(false); }
			if(albumNav === true) { setAlbumNav(false); }
			if(episodeNav === true) { setEpisodeNav(false); }
			setTrackNav(true); 
		}

		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	
		if(object !== undefined && object) {
			const tblBody = document.createElement("tbody");
			let item = object['items'];
			if(item !== undefined) {
			  let tblRow = document.createElement("tr");
			  let details = emptyDetail();
			  for (let i = 0; i < item.length; i++){
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  const wrapper = document.createElement("td");
				  const image = document.createElement("img");
				  if(objectType === "track") { 
					  details = trackDetail(item, i); 
				  }
				  image.src = item[i]['album']['images'][1]['url'];
				  image.alt = item[i]['name'];

				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  tblRow.appendChild(wrapper);
			 }
		} 
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
		}
	}

	function resultNavigation(object: Object) {
		if(object['href'] !== undefined){
		const objectType = object['href'].split("&")[1].split("=")[1];
		return(
			<div>
				{object['previous'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => refreshData(accessToken, object['previous'], objectType)}><Typography>Previous</Typography></Button>}
		        {object['next'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => refreshData(accessToken, object['next'], objectType)}><Typography>Next</Typography></Button>}
			</div>
		);}
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
		   <FormControlLabel control={<Switch checked={filter.show} onChange={checkboxChange} name="show" />} label="Shows" />

		  <FormControlLabel control={<Switch checked={filter.episode} onChange={checkboxChange} name="episode" />} label="Episodes" />
		  <FormControlLabel control={<Switch checked={filter.audiobook} onChange={checkboxChange} name="audiobook" />} label="Audiobooks" />
		 </FormGroup>
		 <br></br>
		 <br></br>
		  <Button variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, searchName, parseFilters())}><Typography>Search</Typography></Button>
		  <div id="errorDiv"></div>
		  {isLoggedIn && parseReturned(tracks, artists, albums, playlists, shows, episodes, audiobooks)}
		  {isLoggedIn && (Object.keys(playlists).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parsePlaylist(playlists))}>
			<Typography>Playlists</Typography>
			</Button>
		  }
		  {isLoggedIn && (Object.keys(albums).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parsePlaylist(albums))}>
			<Typography>Albums</Typography>
			</Button>
		  }
		  {isLoggedIn && (Object.keys(tracks).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parseTrack(tracks))}>
			<Typography>Tracks</Typography>
			</Button>
		  }
		  {isLoggedIn && (Object.keys(artists).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parseArtist(artists))}>
			<Typography>Artists</Typography>
			</Button>
		  }
		  {isLoggedIn && (Object.keys(episodes).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parseEpisode(episodes))}>
			<Typography>Episodes</Typography>
			</Button>
		  }
		  {isLoggedIn && (Object.keys(shows).length > 1) && <Button 
			className={styles.row} 
			variant="contained" 
			size="large" color="primary" 
			onClick={() => document.getElementById("myDiv").appendChild(parseShow(shows))}>
			<Typography>Shows</Typography>
			</Button>
		  }
		  {isLoggedIn && (trackNav) && resultNavigation(tracks)}
		  {isLoggedIn && (artistNav) && resultNavigation(artists)}
		  {isLoggedIn && (albumNav) && resultNavigation(albums)}
		  {isLoggedIn && (playlistNav) && resultNavigation(playlists)}
		  {isLoggedIn && (episodeNav) && resultNavigation(episodes)}
		  {isLoggedIn && (showNav) && resultNavigation(shows)}
 		 <br></br>
		 <br></br>
		<div id="myDiv"></div>
		</div>
	);
}
