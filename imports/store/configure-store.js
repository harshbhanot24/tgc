import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const logger = createLogger()
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}
