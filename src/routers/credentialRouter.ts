import express, { Router } from 'express';
import credentialController from '../controllers/credentialController';

const router = Router();
const CredentialController = new credentialController();

router.get('/', CredentialController.get);

export default router;