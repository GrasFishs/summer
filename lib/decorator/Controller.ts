import Handler from '../core/Controller';

export const Repository = Handler.addComponent('Repository');
export const Service = Handler.addComponent('Service');
export const Controller = Handler.addController();
export const Middleware = Handler.addMiddleware();

export const Get = Handler.addRouteMethod('get');
export const Post = Handler.addRouteMethod('post');
export const Put = Handler.addRouteMethod('put');
export const Delete = Handler.addRouteMethod('delete');

export const Param = Handler.addArgument('params');
export const Body = Handler.addArgument('body');
export const Query = Handler.addArgument('query');
export const Header = Handler.addArgument('headers');
export const Res = Handler.addArgument('res');
export const Req = Handler.addArgument('req');
export const Next = Handler.addArgument('next');
