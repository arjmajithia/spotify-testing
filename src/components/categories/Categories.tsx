import { useState } from 'react';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { setCategoriesAsync, selectCategories } from './categoriesSlice';
import { selectAccessToken, selectIsLoggedIn } from '../authorization/authorizationSlice';

import styles from './Categories.module.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';


export function Categories() {
	/** need states for category id if added */
	const [categoryid, setCategoryid] = useState('');

	const dispatch = useAppDispatch();
	/** need access token for fetch as always, and isLogged to toggle button */
	const accessToken = useAppSelector(selectAccessToken);
	const isLoggedIn = useAppSelector(selectIsLoggedIn);
	const categories = useAppSelector(selectCategories);

	/** search query! */
	function querySpotify(accessToken: string, id: string, url: string) {
		dispatch(setCategoriesAsync(accessToken, id, url));
	}

	/** querySpotify uses id, parseURL pulls id from previous/next url */
	function parseURL(getURL: string) {
		const newurl = "?".concat(getURL.split("?")[1]);
		return newurl;
	}

	/** attaches opendetail onClick to image */
	function openDetail(detail: Element){
		detail.open = !detail.open;
	}
	
	/** returns details element  */
	function newDetail(item: Object, index: Number = NaN) {
		/** initialize elements */
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const categoryLink = document.createElement("button");
		let summaryHTML = "";
		/** this does not work without if statement */
		if(index || index === 0) {
			/** returns name and link to view  category */
		   summaryHTML = item[index]['name'].concat("<br>");
		   categoryLink.onclick = () => querySpotify(accessToken, item[index]['id']);
		   categoryLink.innerHTML = item[index]['name'];
		} else {
		   /** returns name and link to view  category */
		   summaryHTML = item['name'].concat("<br>");
		   categoryLink.href = item['href'];
		   categoryLink.innerHTML = item['name'];
		}
		 summary.innerHTML = summaryHTML;		
		 details.insertAdjacentElement("afterbegin", categoryLink);
		 details.insertAdjacentElement("afterbegin", summary);
		
		  return(details);
	}

	function parseReturned(categories: Object) {
		/** empty the div that the data is sent to */
		let container = document.getElementById("myDiv");
		if(container?.childElementCount > 0){
			while(container?.firstChild){ container.removeChild(container.firstChild); }
		}

		/** initialize elements */
		const output = document.createElement("div");
		const tblContainer = document.createElement("table");
	    tblContainer.className = '{styles.tbl}';	

		if(categories !== undefined && categories) {
			/** initialize body element, set item for easier access */
			const tblBody = document.createElement("tbody");
			let item = categories['items'];
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
				  image.src = item[i]['icons'][0]['url'];
				  image.alt = item[i]['name'];
				  image.onclick = () => openDetail(details);

				  /** append elements */
				  wrapper.appendChild(details);
				  wrapper.appendChild(image);

				  tblRow.appendChild(wrapper);
			 }
		} 
		else if(Object.keys(categories).length !== 0) /** if categories is composed of one item */
			{
			const wrapper = document.createElement("div");
			const image = document.createElement("img");
			const details = newDetail(categories);
			image.src = categories['icons'][0]['url'];
			image.alt = categories['name'];
			image.onclick = () => openDetail(details);

			wrapper.appendChild(details);
			wrapper.appendChild(image);

			output.appendChild(wrapper);
			return(output);
		}
			/** append and return necessary elements */
			tblContainer.appendChild(tblBody);
		}
		output.appendChild(tblContainer);
		return(output);
	}

	/** refreshes parsed Data on categories refresh (with new data) */
	function renderOnLoad() {
		document.getElementById("myDiv")?.appendChild(parseReturned(categories));
	}

	return (
		<div>
		 {isLoggedIn && <TextField label="Search a category ID" variant="outlined" onChange={(e) => setCategoryid(e.target.value)}></TextField>}
		 <br></br>
		 <br></br>
		 {isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, categoryid)}><Typography>view genres</Typography></Button>}
		 {isLoggedIn && categories['previous'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, "", parseURL(categories['previous']))}><Typography>Previous</Typography></Button>}
		 {isLoggedIn && categories['next'] && <Button className={styles.row} variant="contained" size="large" color="primary" onClick={() => querySpotify(accessToken, "", parseURL(categories['next']))}><Typography>Next</Typography></Button>}
		 <br></br><br></br>
		 {isLoggedIn && (categories !== {}) && renderOnLoad()}
		 <div id="myDiv"></div>
		</div>
	);
}
