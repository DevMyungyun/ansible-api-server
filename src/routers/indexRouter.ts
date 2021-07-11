import express, { Router } from 'express';
import indexController from '../controllers/indexController';

const router = Router();
const IndexController = new indexController();

router.get('/', IndexController.get);

export default router;