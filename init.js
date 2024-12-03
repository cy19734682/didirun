const {
  initConfig,
  initMysql,
  initAdminConfig,
  initNginx,
  initMiniappConfig,
  execServer,
  execAdmin,
} = require("./buildconfig");
const init = async () => {
  initConfig();
  await initMysql();
  await execServer();
  initAdminConfig();
  await execAdmin();
  initNginx();
  initMiniappConfig();
};
init();