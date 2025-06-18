import {eventHandler, toWebRequest} from 'vinxi/http';
import {auth} from '../auth';

export default eventHandler(async event => {
  return auth.handler(toWebRequest(event));
});
