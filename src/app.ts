import Application from '../lib/core/Application';
import BeanFactory from '../lib/factory/bean';
import { LogMiddleware } from './middleware/LogMiddleware';

const app = Application.create();
const port = BeanFactory.get('config').port;
app.use(new LogMiddleware());
app.listen(port, () => {
  console.log('service listening at ' + port);
});
