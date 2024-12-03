const {
  initConfig,
  initMysql,
  initAdminConfig,
  initNginx,
  initMiniappConfig,
} = require("./buildconfig");
const init = async () => {
  initConfig();
  await initMysql();
  initAdminConfig();
  initNginx();
  initMiniappConfig();
};
init();
