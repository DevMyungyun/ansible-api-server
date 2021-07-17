import express, { Router } from 'express';
import inventoryController from '../controllers/inventoryController';

const router = Router();
const InventoryController = new inventoryController();

router.get('/', InventoryController.get);

export default router;