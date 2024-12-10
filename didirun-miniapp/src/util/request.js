import { API } from "./constant.js";
import store from "../store";

export const request = async (url, data, method, needNo = true) => {
  const provider = await getProviderSync();
  const header = {};
  if (provider === "weixin") {
    header.wxappno = needNo ? await getNo("wxappNo") : undefined;
  } else if (provider === "alipay") {
    header.aliappno = needNo ? await getNo("aliappNo") : undefined;
  } else if (provider === "qq") {
    header.qqappno = needNo ? await getNo("qqappNo") : undefined;
  } else if (provider === "toutiao") {
    header.ttappno = needNo ? await getNo("ttappno") : undefined;
  }
  return new Promise((resolve) => {
    uni.request({
      url: API + url,
      data,
      method,
      header,
      complete: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 203) {
            uni.showModal({
              title: "温馨提示",
              content: "您还未登录，请先登录！",
              confirmText: "去登录",
              cancelText: "再逛逛",
              success: function (res) {
                if (res.confirm) {
                  const provider = uni.getStorageSync("provider");
                  uni.navigateTo({
                    url:
                      provider === "qq"
                        ? "/pages/login/phone/phone"
                        : "/pages/login/login",
                  });
                } else if (res.cancel) {
                  uni.navigateBack({
                    delta: 1,
                  });
                }
              },
            });
            return;
          }
          if (res.data.code !== 200) {
            uni.showToast({
              icon: "none",
              title: res.data.msg,
            });
          }
          resolve(res.data);
        } else {
          resolve({
            code: 9999,
            msg: "error",
          });
          uni.showToast({
            icon: "error",
            title: "服务端错误",
          });
        }
      },
    });
  });
};

export const post = (url, data) => {
  return request(url, data, "POST");
};

export const put = (url, data) => {
  return request(url, data, "PUT");
};

export const del = (url, data) => {
  return request(url, data, "DELETE");
};

export const $get = (url, data, needNo) => {
  return request(url, data, "GET", needNo);
};

export const getNo = async (name) => {
  let no = uni.getStorageSync(name);
  if (!no) {
    no = await getProviderSync();
  }
  return no;
};

// 获取当前端
export const getProviderSync = async () => {
  return new Promise((resolve) => {
    uni.getProvider({
      service: "oauth",
      complete(res) {
        resolve(res.provider[0]);
      },
    });
  });
};

export const login = () => {
  return new Promise((resolve) => {
    uni.getProvider({
      service: "oauth",
      complete: (res) => {
        const provider = res.provider[0];
        uni.setStorageSync("provider", provider);
        uni.login({
          provider,
          success: async (res) => {
            if (provider === "weixin") {
              const result = await $get(
                "wxapp/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("wxappNo", result.data.wxappNo);
                if (result.data.user) {
                  store.commit("auth/setUserInfo", result.data.user);
                }
                resolve(result.data.wxappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "alipay") {
              const result = await $get(
                "alipay/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("aliappNo", result.data.aliappNo);
                if (result.data.user) {
                  store.commit("auth/setUserInfo", result.data.user);
                }
                resolve(result.data.aliappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "qq") {
              const result = await $get(
                "qq/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("qqappNo", result.data.qqappNo);
                if (result.data.user) {
                  store.commit("auth/setUserInfo", result.data.user);
                }
                resolve(result.data.qqappNo);
              } else {
                resolve(false);
              }
            } else if (provider === "toutiao") {
              const result = await $get(
                "toutiao/login",
                {
                  code: res.code,
                },
                false
              );
              if (result.code === 200) {
                uni.setStorageSync("ttappNo", result.data.ttappNo);
                if (result.data.user) {
                  store.commit("auth/setUserInfo", result.data.user);
                }
                resolve(result.data.ttappNo);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          },
        });
      },
    });
  });
};

export const info = async () => {
  const res = await $get("user/info");
  if (res.code === 200) {
    store.commit("auth/setUserInfo", res.data);
  }
};

export const upload = async (filePath) => {
  return new Promise((resolve) => {
    uni.uploadFile({
      url: API + "upload/put",
      filePath,
      name: "file",
      formData: {},
      complete(e) {
        if (e.statusCode === 200) {
          const json = JSON.parse(e.data);
          if (json.code === 200) {
            resolve(json.data);
          } else {
            uni.showToast({
              icon: "none",
              msg: json.msg,
            });
            resolve("");
          }
        } else {
          uni.showToast({
            icon: "none",
            msg: "上传图片失败",
          });
          resolve("");
        }
      },
    });
  });
};

export const requestSubscribeMessage = async (tmpIds) => {
  return new Promise((resolve) => {
    uni.requestSubscribeMessage({
      tmplIds: tmpIds,
      complete: async (res) => {
        resolve(res);
      },
    });
  });
};
