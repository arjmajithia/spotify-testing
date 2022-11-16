import { selectFeatPlaylist, featPlaylistAsync } from './featplaylistSlice';
import styles from './featPlaylist.module.css';
import { selectIsLoggedIn,selectAccessToken } from '../authorization/authorizationSlice';
import { useAppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../app/hooks';

export function FeaturedPlaylists() {
	/** necessary variables */
	const isLoggedIn = useAppSelector(selectIsLoggedIn);
	const accessToken = useAppSelector(selectAccessToken);
	const dispatch = useAppDispatch();

	/** assign playlist data */
	const featPlaylist = useAppSelector(selectFeatPlaylist);

	/** search query! */
	function callFeatured(accessToken: string, getURL: string) {
		if (isLoggedIn) {
			dispatch(featPlaylistAsync(accessToken, getURL));
		}
	};

	/** attaches opendetail onClick to image */
	function openDetail(detail: Element){
		detail.open = !detail.open;
	}

	/** returns details element  */
	function newDetail(item: Object, index: Number = NaN) {
		/** initialize elements */
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const playlistLink = document.createElement("a");
		let summaryHTML = "";
		/** this does not work without if statement */
		if(index || index === 0) {
		   /** returns name, and spotify url */
		   summaryHTML = item[index]['name'];
		   playlistLink.href = item[index]['external_urls']['spotify'];
		   playlistLink.innerHTML = item[index]['name'];
		} 
		 summary.innerHTML = summaryHTML;		
		 details.insertAdjacentElement("afterbegin", playlistLink);
		 details.insertAdjacentElement("afterbegin", summary);
		
		  return(details);
	}

	function parseReturned(featPlaylist: Object) {
		/** empty the div that the data is sent to */
		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		/** initialize elements */
		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	

		if(featPlaylist !== undefined && featPlaylist) {
			/** initialize body element, set item for easier access */
			const tblBody = document.createElement("tbody");
			let item = featPlaylist['items'];
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
				  image.src = item[i]['images'][0]['url'];
				  image.alt = item[i]['name'];
				  image.onclick = () => openDetail(details);

				  /** append elements  */
				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  tblRow.appendChild(wrapper);
			 }
		} 
			/** append and return necessary elements */
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
	}

	/** refreshes parsed Data on categories refresh (with new data) */
	function outputDataAsync() {
		document.getElementById("myDiv")?.appendChild(parseReturned(featPlaylist));
	}

	return (
		<div>
			{isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => callFeatured(accessToken, `https://api.spotify.com/v1/browse/featured-playlists`)}><Typography>get featured</Typography></Button>}
			{isLoggedIn && featPlaylist['previous'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callFeatured(accessToken, featPlaylist['previous'])}><Typography>Previous</Typography></Button>}
			{isLoggedIn && featPlaylist['next'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => callFeatured(accessToken, featPlaylist['next'])}><Typography>Next</Typography></Button>}
			{isLoggedIn && (featPlaylist !== {}) && outputDataAsync()}
			<div id="myDiv"></div>
		</div>
	);
}
