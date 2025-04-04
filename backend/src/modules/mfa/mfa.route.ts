import { Router } from 'express';
import { mfaController } from './mfa.module';
import { authenticateJWT } from '../../common/strategy/jwt.strategy';

const mfaRoutes = Router();

mfaRoutes.get("/setup", authenticateJWT, mfaController.generateMFAsetup);
mfaRoutes.post("/verify", authenticateJWT, mfaController.verifyMFAsetup);
mfaRoutes.put("/revoke", authenticateJWT, mfaController.revokeMFA);
mfaRoutes.post("/verify-login", mfaController.verifyLoginMfa);

export default mfaRoutes;

