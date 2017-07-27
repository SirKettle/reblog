import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { router5Middleware } from 'redux-router5';
import rootStateInjector from './middleware/rootStateInjector';
// import logger from 'redux-logger';
import rootReducer from '../reducers';

export default function configureStore(router, initialState = {}) {
  const store = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(
      router5Middleware(router),
      rootStateInjector
      // logger()
    )
  ));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index.js'); /* eslint global-require: 0 */
      store.replaceReducer(nextRootReducer);
    });
  }

  window.store = store;
  return store;
}
