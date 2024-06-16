import { Express, Router } from 'express';
import { di } from '../di';
import MenuController from '../controllers/menu.controller';
import MenuService from '../services/menu.service';
import CategoryService from '../services/category.service';
import CategoryController from '../controllers/category.controller';
import LoginController from '../controllers/login.controller';
import LoginService from '../services/login.service';
import RegisterController from '../controllers/register.controller'; // Adicione isto
import RegisterService from '../services/register.service'; // Adicione isto
import authMiddleware from '../core/authentication';

const router = Router();
const prefix = '/api';

export default (app: Express) => {
  // Rota de Login
  app.use(
    `${prefix}`,
    new LoginController(router, di.getService(LoginService)).router
  );

  // Rota de Registro
  app.use(
    `${prefix}`,
    new RegisterController(router, di.getService(RegisterService)).router // Adicione isto
  );

  // Middleware de autenticação aplicado às rotas que necessitam
  app.use(authMiddleware);

  // Rotas que necessitam de autenticação
  app.use(
    `${prefix}`,
    new MenuController(router, di.getService(MenuService)).router
  );
  app.use(
    `${prefix}`,
    new CategoryController(router, di.getService(CategoryService)).router
  );

  app.use((_, res) => {
    res.status(404).send({ message: 'Rota não encontrada.' });
  });
};
