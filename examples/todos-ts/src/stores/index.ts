import Icestore from '@ice/store';
import logger from '@ice/store-logger';
import todos from './todos';
import user from './user';

const icestore = new Icestore();

const middlewares: ((ctx, next) => {})[] = [];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

// icestore.applyOptions({
//   disableLoading: true
// });
icestore.applyMiddleware(middlewares);

const stores = icestore.registerStores({
  todos,
  user,
});

export default stores;