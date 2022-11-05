import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setAccessToken, setTokenExpiryDate, selectIsLoggedIn, selectAccessToken, selectTokenExpiryDate } from './authorizationSlice';
import styles from '../counter/Counter.module.css';
import { getAuthorizeHref } from '../../oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import { setUserProfileAsync } from '../userinfo/userInfoSlice';
import { AppDispatch } from '../../app/store';
import { UserInfo } from '../userinfo/UserInfo';

const hashParams = getHashParams();
const access_token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

export function Authorization() {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const tokenExpiryDate = useSelector(selectTokenExpiryDate);
	const dispatch = useDispatch<AppDispatch>(); 

	useEffect(() => {
		if (access_token) {
			dispatch(setLoggedIn(true));
			dispatch(setAccessToken(access_token));
			dispatch(setTokenExpiryDate(Number(expires_in)));
			dispatch(setUserProfileAsync(access_token));
		}
	}, []);

	return (
		<div>
			<div className={styles.row}>
				{!isLoggedIn && <button className={styles.button} onClick={() => window.open(getAuthorizeHref(), '__self')}>Log in to Spotify</button>}
				{isLoggedIn && <div className={styles.row}>Token expiry date: {tokenExpiryDate}<p><UserInfo /></p></div>}
			</div>
		</div>
	);
}
