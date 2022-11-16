import { useSelector } from 'react-redux';
import { selectDisplayName, selectType, selectUri, selectFollowers, checkProfileAsync } from './userInfoSlice';
import styles from './UserInfo.module.css';
import { selectIsLoggedIn } from '../authorization/authorizationSlice';
import { AppDispatch, useAppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../app/hooks';

export function UserInfo(accessToken: string) {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const dispatch = useAppDispatch();

	const displayName = useAppSelector(selectDisplayName);
	const type = useAppSelector(selectType);
	const followers = useAppSelector(selectFollowers);
	const followerstring = (followers.hasOwnProperty('total') ? JSON.stringify(followers).slice(1,-1).split(",")[1] : '');

	function callProfile(accessToken: string) {
		if (isLoggedIn) {
			dispatch(checkProfileAsync(accessToken));
		}
	};

	return (
		<div>
			{isLoggedIn && !displayName && <Button variant="contained" size="large" color="primary" onClick={() => callProfile(accessToken)}><Typography>Profile</Typography></Button>}
			{displayName && <div className={styles.row}> Logged in as: {displayName}</div>}
			{type && <div className={styles.row}> Login type: {type}</div>}
			{followerstring && <div className={styles.row}> Follower {followerstring}</div>}
		</div>
	);
}
