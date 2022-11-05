import { useSelector } from 'react-redux';
import { selectDisplayName, selectType, selectUri, selectFollowers, setUserProfileAsync } from './userInfoSlice';
import styles from './UserInfo.module.css';
import { selectIsLoggedIn } from '../authorization/authorizationSlice';


export function UserInfo() {
	const isLoggedIn = useSelector(selectIsLoggedIn);

	const displayName = useSelector(selectDisplayName);
	const type = useSelector(selectType);
	const uri = useSelector(selectUri);
	const followers = useSelector(selectFollowers);
	const followerstring = (followers.hasOwnProperty('total') ? JSON.stringify(followers).slice(1,-1).split(",")[1] : '');

	function getProfile() {
		return (
				<div>
				{uri && <div className={styles.row}> Return URI: {uri}</div>}
				{displayName && <div className={styles.row}> Logged in as: {displayName}</div>}
				{type && <div className={styles.row}> Login type: {type}</div>}
				{followerstring && <div className={styles.row}> Follower {followerstring}</div>}
				</div>
			   );
	}
	return (
		<div>
			{isLoggedIn && <button onClick={() => getProfile()}>Profile</button>}
		</div>
	);
}
