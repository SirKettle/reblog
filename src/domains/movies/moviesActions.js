import 'whatwg-fetch';
import { buildUrlWithQueryParams } from '../../utils/api';

export const actionTypes = {
  LOAD_CONFIGURATION_PENDING: 'LOAD_CONFIGURATION_PENDING',
  LOAD_CONFIGURATION_SUCCESS: 'LOAD_CONFIGURATION_SUCCESS',
  LOAD_CONFIGURATION_ERROR: 'LOAD_CONFIGURATION_ERROR',
  LOAD_MOVIES_PENDING: 'LOAD_MOVIES_PENDING',
  LOAD_MOVIES_SUCCESS: 'LOAD_MOVIES_SUCCESS',
  LOAD_MOVIES_ERROR: 'LOAD_MOVIES_ERROR'
};

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '9b39e698383c30052915f7786495b569';

const ENDPOINTS = {
  CONFIGURATION: '/configuration', // /configuration?api_key=<<api_key>>
  DISCOVER_MOVIES: '/discover/movie' // /discover/movie?with_genres=35&&api_key=9b39e698383c30052915f7786495b569
};

export const loadConfiguration = (dispatch) => {
  dispatch({
    type: actionTypes.LOAD_CONFIGURATION_PENDING
  });
  
  const url = buildUrlWithQueryParams(`${BASE_URL}${ENDPOINTS.CONFIGURATION}`, { api_key: API_KEY });
  return fetch(url, {
    method: 'GET'
  }).then(response => response.json()
  , (error) => {
    dispatch({
      type: actionTypes.LOAD_CONFIGURATION_ERROR,
      error
    });
  }).then((payload) => {
    console.log(payload);
    dispatch({
      type: actionTypes.LOAD_CONFIGURATION_SUCCESS,
      payload
    });
  });
};

export const loadMovies = (dispatch, args) => {
  dispatch({
    type: actionTypes.LOAD_MOVIES_PENDING
  });

  const queryParams = {
    ...args.queryParams,
    page: 1,
    include_video: false,
    include_adult: false,
    sort_by: 'popularity.desc',
    language: 'en-US',
    original_language: 'en',
    api_key: API_KEY
  };
  const url = buildUrlWithQueryParams(`${BASE_URL}${ENDPOINTS.DISCOVER_MOVIES}`, queryParams);
  return fetch(url, {
    method: 'GET'
  }).then(response => response.json()
  , (error) => {
    // console.log(error);
    dispatch({
      type: actionTypes.LOAD_MOVIES_ERROR,
      error
    });
  }).then((payload) => {
    console.log(payload);
    dispatch({
      type: actionTypes.LOAD_MOVIES_SUCCESS,
      payload
    });
  });
};