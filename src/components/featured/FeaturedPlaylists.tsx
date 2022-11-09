import { useSelector } from 'react-redux';
import { selectFeatPlaylist, featPlaylistAsync } from './featplaylistSlice';
import styles from './featPlaylist.module.css';
import { selectIsLoggedIn,selectAccessToken } from '../authorization/authorizationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export function FeaturedPlaylists() {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const accessToken = useSelector(selectAccessToken);
	const dispatch = useDispatch<AppDispatch>();

	const featPlaylist = useSelector(selectFeatPlaylist);

	function callFeatured(accessToken: string) {
		if (isLoggedIn) {
			dispatch(featPlaylistAsync(accessToken));
		}
	};

	return (
		<div>
			{isLoggedIn && <Button variant="contained" size="large" color="primary" onClick={() => callFeatured(accessToken)}><Typography>get featured</Typography></Button>}
			{featPlaylist && <div className={styles.row}> Playlists: {JSON.stringify(featPlaylist)}</div>}
		</div>
	);
}
