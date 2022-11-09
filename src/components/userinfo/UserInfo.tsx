import { useSelector } from 'react-redux';
import { selectDisplayName, selectType, selectUri, selectFollowers, checkProfileAsync } from './userInfoSlice';
import styles from './UserInfo.module.css';
import { selectIsLoggedIn } from '../authorization/authorizationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export function UserInfo(accessToken: string) {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const dispatch = useDispatch<AppDispatch>();

	const displayName = useSelector(selectDisplayName);
	const type = useSelector(selectType);
	const uri = useSelector(selectUri);
	const followers = useSelector(selectFollowers);
	const followerstring = (followers.hasOwnProperty('total') ? JSON.stringify(followers).slice(1,-1).split(",")[1] : '');

	function callProfile(accessToken: string) {
		if (isLoggedIn) {
			dispatch(checkProfileAsync(accessToken));
		}
	};

	return (
		<div>
			{isLoggedIn && !displayName && <Button variant="contained" size="large" color="primary" onClick={() => callProfile(accessToken)}><Typography>Profile</Typography></Button>}
			{uri && <div className={styles.row}> Return URI: {uri}</div>}
			{displayName && <div className={styles.row}> Logged in as: {displayName}</div>}
			{type && <div className={styles.row}> Login type: {type}</div>}
			{followerstring && <div className={styles.row}> Follower {followerstring}</div>}
		</div>
	);
}
