import { selectNewReleases, newReleasesAsync } from './newreleasesSlice';
import styles from './newReleases.module.css';
import { selectIsLoggedIn,selectAccessToken } from '../authorization/authorizationSlice';
import { useAppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../app/hooks';

export function NewReleases() {
	const dispatch = useAppDispatch();

	/** new releases to store returned data  */
	const newReleases = useAppSelector(selectNewReleases);
	/** need to make sure we are logged in  */
	const isLoggedIn = useAppSelector(selectIsLoggedIn);
	/** need the access token for Spotify to return correctly  */
	const accessToken = useAppSelector(selectAccessToken);

	/** search query! */
	function callNewReleases(accessToken: string, getURL: string) {
		if (isLoggedIn) {
		  if(getURL !== null){
		    dispatch(newReleasesAsync(accessToken, getURL));
		  } else {
			console.log("no more on this side");
		  }
		}
	}

	/** attaches opendetail onClick to image */
	function openDetail(detail: Element){
		detail.open = !detail.open;
	}
	
	/** returns details element  */
	function newDetail(item: Object, index: Number) {
		/** initialize elements */
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const link = document.createElement("a");

		/** returns name, album type (single/album/etc.), release date, total tracks */
		summary.innerHTML = item[index]['name'];
		details.innerHTML = item[index]['album_type'].concat("<br>");
		details.insertAdjacentText("beforeend", "Release: ");
		details.insertAdjacentHTML("beforeend", item[index]['release_date'].concat("<br>"));
		details.insertAdjacentHTML("beforeend", JSON.stringify(item[index]['total_tracks']).concat(" tracks<br>"));

		/** return artists: if = 1 return(artist), if > 1 return(artist1, artist2, etc.)  */
		details.insertAdjacentText("beforeend", "Artists: ");
		for (let i = 0; i < item[index]['artists'].length; i++) {
			/** each artist has a link */
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

		/** return link to listen on spotify */
		link.href=item[index]['external_urls']['spotify'];
		link.innerHTML = "Listen on Spotify";
		
		details.insertAdjacentElement("beforeend", link);
		details.insertAdjacentElement("afterbegin", summary);
		
		return(details);
	}

	function parseReturned(newReleases: Object) {
		/** empty the div that the data is sent to */
		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		/** initialize elements */
		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	

		if(newReleases !== undefined) {
			/** initialize body element, set item for easier access */
			const tblBody = document.createElement("tbody");
			let item = newReleases['items'];
			if(item !== undefined) {
			let tblRow = document.createElement("tr");
			  for (let i = 0; i < item.length; i++){
				  /** 3 items per row: use modulo to determine it */
				  if(i%3 === 0){ tblBody.appendChild(tblRow); tblRow = document.createElement("tr"); }
				  /** initialize wrapper,image and details (details from detail func) */
				  const wrapper = document.createElement("td");
				  const image = document.createElement("img");
				  const details = newDetail(item, i);

				  /** attach image, alt, and onclick to image element */
				  image.src = item[i]['images'][1]['url'];
				  image.alt = item[i]['name'];
				  image.onclick = () => openDetail(details);

				  /** append elements */
				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  tblRow.appendChild(wrapper);
			 }
		}else {
			output.innerHTML = 'Search returned nothing!';
			return(output);
		}
			/** append and return necessary elements */
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
	}

	/** refreshes parsed Data on categories refresh (with new data) */
	function outputDataAsync() {
		document.getElementById("myDiv")?.appendChild(parseReturned(newReleases));
	}

	return (
		<div>
			{isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() =>  callNewReleases(accessToken, `https://api.spotify.com/v1/browse/new-releases`)}><Typography>New Releases</Typography></Button>}
			{isLoggedIn && newReleases['previous'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken, newReleases['previous'])}><Typography>Previous</Typography></Button>}
			{isLoggedIn && newReleases['next'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken, newReleases['next'])}><Typography>Next</Typography></Button>}
			{isLoggedIn && (newReleases !== {}) && outputDataAsync()}
			<div id="myDiv"></div>
		</div>
	);
}
