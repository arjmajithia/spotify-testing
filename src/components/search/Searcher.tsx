import { useDispatch, useSelector } from 'react-redux';
import { selectTracks, selectArtists, selectAlbums, selectPlaylists } from './searcherSlice';
import styles from './Searcher.module.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardHeader, TextField, CircularProgress } from '@material-ui/core';
import { AppDispatch } from '../../app/store';

const useStyles = makeStyles({
	root: {
		width: 275,
		height: 275,
		alignSelf: 'middle',
		justifySelf: 'start'
	},
	content: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '2vh'
	},
	button: {
		marginTop: '10px',
		height: '7vh',
		width: '90%'
	},
	input: {
		width: '90%'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	},
});


export function Searcher() {
	const classes = useStyles();

	const tracks = useSelector(selectTracks);
	const artists = useSelector(selectArtists);
	const albums = useSelector(selectAlbums);
	const playlists = useSelector(selectPlaylists);

	const tracksstring = (tracks.hasOwnProperty('tracks') ? JSON.stringify(tracks).slice(1,-1) : '');
	const artistsstring = (artists.hasOwnProperty('total') ? JSON.stringify(artists).slice(1,-1) : '');
	const albumsstring = (albums.hasOwnProperty('total') ? JSON.stringify(albums).slice(1,-1) : '');
	const playlistsstring = (playlists.hasOwnProperty('total') ? JSON.stringify(playlists).slice(1,-1) : '');

	return (
		<Card className={classes.root}>
		<CardHeader title={<Typography variant="h5" component="h2">Find Song</Typography>}></CardHeader>
		<CardContent className={classes.content}>
		 <TextField className={classes.input} label="Search a song" variant="outlined"></TextField>
		  <Button className={classes.button} variant="contained" size="large" color="primary">
		   <CircularProgress color="secondary"></CircularProgress> : <Typography>get song</Typography>
		  </Button>
			<div>
			{tracks && <div className={styles.row}> Tracks: {tracksstring}</div>}
			{artists && <div className={styles.row}> Artists: {artistsstring}</div>}
			{albums && <div className={styles.row}> Albums: {albumsstring}</div>}
			{playlists && <div className={styles.row}> Playlists: {playlistsstring}</div>}
			</div>
		</CardContent>
		</Card>
	);
}
