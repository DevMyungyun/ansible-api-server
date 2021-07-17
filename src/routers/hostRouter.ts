import express, { Router } from 'express';
import hostController from '../controllers/hostController';

const router = Router();
const HostController = new hostController();

router.get('/', HostController.get);

export default router;