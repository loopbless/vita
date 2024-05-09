import auth from "./auth.js";
import clients from "./clients.js";
import users from "./users.js";
// import resources from "./resources";
// import roles from "./roles";
import { router } from "@vita/core";

// const router = new HyperExpress.Router();

// router.use('/oauth', auth);s
// router.use('/clients', clients);
// router.use('/users', users);
// router.use('/resources', resources);
// router.use('/roles', roles);

const appRouter = router({
  oauth: auth,
  clients,
  users
});

export default appRouter;

export type AppRouter = typeof appRouter;