import express from 'express'
import {handleQuota, updatePlan,checkout } from '../controllers/subscription.js';
const router=express.Router()


router.post('/checkout',checkout)
router.post('/updatePlan',updatePlan)
router.post('/quota',handleQuota)
export default router;