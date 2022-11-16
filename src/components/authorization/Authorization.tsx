import { useEffect } from 'react';
import { setLoggedIn, setAccessToken, setTokenExpiryDate, selectIsLoggedIn } from './authorizationSlice';
import styles from '../counter/Counter.module.css';
import { getAuthorizeHref } from '../../oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import { useAppDispatch } from '../../app/store';
import { UserInfo } from '../userinfo/UserInfo';
import { useAppSelector } from '../../app/hooks';

/** pull expiry and token from hash, then remove params  */
const hashParams = getHashParams();
const access_token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

export function Authorization() {
	const isLoggedIn = useAppSelector(selectIsLoggedIn);
	const dispatch = useAppDispatch();

	/** onClick sets access_token, expiry time, and LoggedIn  */
	useEffect(() => {
		if (access_token) {
			dispatch(setLoggedIn(true));
			dispatch(setAccessToken(access_token));
			dispatch(setTokenExpiryDate(Number(expires_in)));
		}
	/** unsure why UseEffect needs another dispatch call: eslint to disable the error  */
	// eslint-disable-next-line
	}, []);

	return (
		<div>
			<div className={styles.row}>
				{!isLoggedIn && <button className={styles.button} onClick={() => window.open(getAuthorizeHref(), '__self')}>Log in to Spotify</button>}
				{isLoggedIn && <div className={styles.row}><UserInfo access_token = {access_token}/></div>}
			</div>
		</div>
	);
}
