import { CLIENT_ID, REDIRECT_URI, SCOPE } from './constants/AppConstants';
const authEndpoint = 'https://accounts.spotify.com/authorize';

const scopes = SCOPE.join('20%'); 
export const getAuthorizeHref = (): string => {
		return `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scopes=${scopes}&response_type=token`;
}
