import { Router } from 'express';
import { refreshToken } from '../controllers';


export const router = Router();

//refersh
router.post('/', refreshToken);

