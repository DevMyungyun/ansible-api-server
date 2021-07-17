import express, { Router } from 'express';
import indexController from '../controllers/indexController';

const router = Router();
const IndexController = new indexController();

router.get('/', IndexController.get);
router.get('/playbook', IndexController.getPlaybook);
router.get('/commonCode', IndexController.getCommonCode);
router.get('/analyze/playbook/recap', IndexController.analyzePlaybookRecap);

export default router;