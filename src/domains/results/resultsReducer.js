import Immutable from 'immutable';
import { isNil, sort } from 'ramda';
import { actionTypes } from './resultsActions';
import loadingStates from '../../constants/loadingStates';

const getResultsKey = payload => (isNil(payload.personId) ? payload.genresKey : payload.moodForKey);

export const shuffle = sort(() => {
  return Math.random() > 0.5 ? 1 : -1;
});

const resultsReducers = {
  [actionTypes.LOAD_RESULTS_PENDING]: (state, action) => {
    const { currentMedia, moodForKey } = action.payload;
    return state.setIn(['server', currentMedia, getResultsKey(action.payload), 'loadingStatus'], loadingStates.LOADING)
      .setIn(['ui', moodForKey, 'currentIndex'], 0);
  },
  [actionTypes.LOAD_RESULTS_ERROR]: (state, action) => {
    const { currentMedia } = action.payload;
    return state.setIn(['server', currentMedia, getResultsKey(action.payload), 'loadingStatus'], loadingStates.ERROR);
  },
  [actionTypes.LOAD_RESULTS_SUCCESS]: (state, action) => {
    const { currentMedia, data } = action.payload;
    return state.setIn(
        ['server', currentMedia, getResultsKey(action.payload), 'data'],
        Immutable.fromJS({
          ...data,
          results: shuffle(data.results)
        })
      )
      .setIn(['server', currentMedia, getResultsKey(action.payload), 'loadingStatus'], loadingStates.COMPLETE);
  },
  [actionTypes.LOAD_SINGLE_RESULT_PENDING]: (state, action) => {
    const { currentMedia, id } = action.payload;
    return state.setIn([currentMedia, id, 'loadingStatus'], loadingStates.LOADING);
  },
  [actionTypes.LOAD_SINGLE_RESULT_ERROR]: (state, action) => {
    const { currentMedia, id } = action.payload;
    return state.setIn([currentMedia, id, 'loadingStatus'], loadingStates.ERROR);
  },
  [actionTypes.LOAD_SINGLE_RESULT_SUCCESS]: (state, action) => {
    const { currentMedia, id, data } = action.payload;
    return state.setIn([currentMedia, id, 'loadingStatus'], loadingStates.COMPLETE)
      .setIn([currentMedia, id, 'data'], Immutable.fromJS(data));
  }
};

const configurationReducers = {
  [actionTypes.LOAD_CONFIGURATION_PENDING]: (state) => {
    return state.set('loadingStatus', loadingStates.LOADING);
  },
  [actionTypes.LOAD_CONFIGURATION_SUCCESS]: (state, action) => {
    return state.set('data', Immutable.fromJS(action.payload)).set('loadingStatus', loadingStates.COMPLETE);
  }
};

const initialStates = {
  results: Immutable.Map({
    ui: Immutable.Map({}),
    server: Immutable.Map({}),
    movies: Immutable.Map({}),
    tv: Immutable.Map({})
  }),
  configuration: Immutable.Map({
    data: null,
    loadingStatus: loadingStates.NOT_STARTED
  })
};

export const resultsReducer = (state = initialStates.results, action) => {
  const handler = resultsReducers[action.type];
  return handler ? handler(state, action) : state;
};

export const configurationReducer = (state = initialStates.configuration, action) => {
  const handler = configurationReducers[action.type];
  return handler ? handler(state, action) : state;
};

export default {
  resultsReducer,
  configurationReducer
};
