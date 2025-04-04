import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.services";

const authService = new AuthService();
const authController =  new AuthController(authService);

export {authController, authService};