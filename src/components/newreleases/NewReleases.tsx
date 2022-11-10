import DOMParser from 'react-dom';
import { useSelector } from 'react-redux';
import { selectNewReleases, newReleasesAsync } from './newreleasesSlice';
import styles from './newReleases.module.css';
import { selectIsLoggedIn,selectAccessToken } from '../authorization/authorizationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import { TableContainer, Paper, TableCell } from '@material-ui/core';
import { Table, TableBody, TableRow } from '@material-ui/core';

function tableData(image: Element, name: string, link: Element) {
	return { image, name, link };
}


export function NewReleases() {
	const dispatch = useDispatch<AppDispatch>();

	/** new releases to store returned data  */
	const newReleases = useSelector(selectNewReleases);
	/** need to make sure we are logged in  */
	const isLoggedIn = useSelector(selectIsLoggedIn);
	/** need the access token for Spotify to return correctly  */
	const accessToken = useSelector(selectAccessToken);

	function openDetail(detail: Element){
		detail.open = !detail.open;
	}
	
	function newDetail(item: Object, index: Number) {
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['album_type'].concat("<br>");
		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function newLink(item: Object, index: Number) {
		const link = document.createElement("a");
		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		return(link);
	}

	function parseReturned(newReleases: Object) {
		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		const rows = [];
		const output = document.createElement("div");
	    output.className = "{styles.tbl}";	
		if(newReleases !== undefined) {
			let item = newReleases['items'];
			if(item !== undefined) {
			  for (let i = 0; i < item.length; i++){

				  const wrapper = document.createElement("div");
				  const image = document.createElement("img");
				  const details = newDetail(item, i);
				  image.src = item[i]['images'][1]['url'];
				  image.alt = item[i]['name'];
				  image.onclick = () => openDetail(details);

				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  const link = newLink(item, i);
				  rows.push(tableData(image, item[i]['name'], link));
			 }
		}}
		console.log(rows);
		let htmlBlock = '<TableContainer component={Paper}>'+
		    '<Table aria-label="simple table">'+
			 '<TableBody>'+
			 '<script>'+
			  '{rows.map((row) => ('+
				'<TableRow key={row.image}>'+
				 '<TableCell component="th" scope="row">{row.image}</TableCell>'+
				 '<TableCell align="right">{row.name}</TableCell>'+
				 '<TableCell align="right">{row.link}</TableCell>'+
				'</TableRow>'+
			  '))}'+
			  '</script>'+
			 '</TableBody>'+
			'</Table>'+
		  '</TableContainer>';
		let htmlNode = document.createRange().createContextualFragment(htmlBlock);
		output.appendChild(htmlNode);
		console.log(output);
		return (<TableContainer component={Paper}>
		    <Table aria-label="simple table">
			 <TableBody>
			 <script>
			  {rows.map((row) => (
				<TableRow key={row.image}>
				 <TableCell component="th" scope="row">{row.image}</TableCell>
				 <TableCell align="right">{row.name}</TableCell>
				 <TableCell align="right">{row.link}</TableCell>
				</TableRow>
			  ))}
			  </script>
			 </TableBody>
			</Table>
		  </TableContainer>);
	}

	function callNewReleases(accessToken: string, getURL: string) {
		if (isLoggedIn) {
			dispatch(newReleasesAsync(accessToken, getURL));
		}
	};

	useEffect(() => {
		const div = document.getElementById("myDiv");
		while(div?.firstChild){ div.removeChild(div.firstChild); }
	}, []);

	return (
		<div>
			{isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken, `https://api.spotify.com/v1/browse/new-releases`)}><Typography>New Releases</Typography></Button>}
			{isLoggedIn && newReleases && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken, newReleases['previous'])}><Typography>Previous</Typography></Button>}
			{isLoggedIn && newReleases && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken, newReleases['next'])}><Typography>Next</Typography></Button>}
			{isLoggedIn && newReleases && <div className={styles.row}> Current API call: {JSON.stringify(newReleases['href'])}</div>}
			{isLoggedIn && newReleases && <div className={styles.row}> Next API call: {JSON.stringify(newReleases['next'])}</div>}
			{isLoggedIn && newReleases && <Button variant="contained" size="large" color="primary" onClick={() => parseReturned(newReleases)}><Typography>New Releases</Typography></Button>}
			<div id="myDiv"></div>
		</div>
	);
}
