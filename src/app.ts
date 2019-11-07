import { Application, BeanFactory } from 'summer';
import { LogMiddleware } from './middleware/LogMiddleware';

const app = Application.create();
const port = BeanFactory.get('config').port;
app.use(new LogMiddleware());
app.listen(port, () => {
  console.log('service listening at ' + port);
});
