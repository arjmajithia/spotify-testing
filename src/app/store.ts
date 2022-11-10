import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import authorizationReducer from '../components/authorization/authorizationSlice';
import userInfoReducer from '../components/userinfo/userInfoSlice';
import searcherReducer from '../components/search/searcherSlice';
import featplaylistReducer from '../components/featured/featplaylistSlice';
import newreleasesReducer from '../components/newreleases/newreleasesSlice';
import categoriesReducer from '../components/categories/categoriesSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
	authorization: authorizationReducer,
	userinfo: userInfoReducer,
	searcher: searcherReducer,
    featured: featplaylistReducer,	
	newrelease: newreleasesReducer,	
	categories: categoriesReducer,	
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
