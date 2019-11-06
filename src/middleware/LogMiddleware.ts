import { IMiddleware, MiddlewareCallback } from '../../lib/core/Middleware';

export class LogMiddleware implements IMiddleware {
  resolve(): MiddlewareCallback {
    return (req, res, next) => {
      const start = Date.now();
      next();
      const result = [
        res.statusCode,
        req.method.toUpperCase(),
        req.baseUrl + req.path,
        Date.now() - start + 'ms'
      ];
      if (Object.keys(req.query).length > 0) {
        result.push('query: ' + JSON.stringify(req.query));
      }
      if (req.method.toUpperCase() === 'POST') {
        result.push('body: ' + JSON.stringify(req.body));
      }
      console.log(result.join(' '));
    };
  }
}
