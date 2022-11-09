import { useSelector } from 'react-redux';
import { selectNewReleases, newReleasesAsync } from './newreleasesSlice';
import styles from './newReleases.module.css';
import { selectIsLoggedIn,selectAccessToken } from '../authorization/authorizationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export function NewReleases() {
	const dispatch = useDispatch<AppDispatch>();

	/** new releases to store returned data  */
	const newReleases = useSelector(selectNewReleases);
	/** need to make sure we are logged in  */
	const isLoggedIn = useSelector(selectIsLoggedIn);
	/** need the access token for Spotify to return correctly  */
	const accessToken = useSelector(selectAccessToken);

	function callNewReleases(accessToken: string) {
		if (isLoggedIn) {
			dispatch(newReleasesAsync(accessToken));
		}
	};

	return (
		<div>
			{isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => callNewReleases(accessToken)}><Typography>New Releases</Typography></Button>}
			{newReleases && <div className={styles.row}> Playlists: {JSON.stringify(newReleases)}</div>}
		</div>
	);
}
