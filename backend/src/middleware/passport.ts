import passport from "passport"
import { setupJwtStrategy } from "../common/strategy/jwt.strategy"


const initializePassport = () => {
    setupJwtStrategy(passport);
};

initializePassport();
export default passport;


