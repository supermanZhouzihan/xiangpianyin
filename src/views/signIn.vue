<!-- 
 * @description: 
 * @fileName: signUpIndex.vue 
 * @author: zhouzihan
 * @date: 2023-08-17 09:51:55 
 * @后台人员:  
 * @path:  
 * @version: V1.0.5 
!-->

<template>
  <div class="login">
    <div class="top">
      <img
        src="../assets/ty.png"
        alt=""
        width="70px"
        height="70px"
        style="margin-bottom: 10px"
      />
      <div class="title mb10">天宇食品品鉴会</div>
      <div>签到</div>
    </div>
    <!-- 有报名信息 -->
    <div class="info" v-if="alreadySignUp">
      <div  style="width: 100%">
        <div class="userInfo">
          <div class="signIngoTit mb20">报名信息</div>
          <div class="mb20 cusColor">
            身份：{{ form.member_type == 1 ? "客户" : "供应商" }}
          </div>
          <div class="mb20 cusColor">姓名：{{ form.name }}</div>
          <div class="mb20 cusColor">电话：{{ form.phone }}</div>
          <div class="mb20 cusColor">名称：{{ form.merchant_name }}</div>
        </div>
      </div>
    </div>
    <!-- 无报名信息 -->
    <div v-else style="width: 100%; text-align: center">
      <div style="font-size:.5rem ;margin-bottom: 6rem">-无报名信息-</div>
      <van-button
        @click="goSignUp"
        round
        type="primary"
        size="large"
        class="roundBtn"
      >
        报名并签到
      </van-button>
    </div>
    <van-button
      v-if="!alreadySignIn&&alreadySignUp"
      @click="signIn"
      round
      type="primary"
      size="large"
      class="roundBtn"
    >
      签到
    </van-button>
    <van-button
      v-if="alreadySignIn"
      round
      type="primary"
      size="large"
      class="roundBtnDisAbled"
      disabled
      color="rgb(231,230,230)"
      style="color:#07c160 !important"
    >
      已签到
    </van-button>
    <!-- <van-dialog v-model="dialog" title="报名查询" :showConfirmButton="false">
      <van-field
        v-model="tel"
        center
        clearable
        label="报名手机号"
        placeholder="请输入手机号"
        class="mb20"
      >
        <template #button>
          <van-button size="small" type="primary" @click="getInfoByTel"
            >查询</van-button
          >
        </template>
      </van-field>

      <div
        v-if="!alreadySignUp && searchStatus"
        style="width: 100%; text-align: center; padding: 5px"
      >
        <div class="mb10">-无报名信息-</div>

        <van-button
          @click="goSignUp"
          round
          type="primary"
          size="large"
          class="mb20 custRoundBtn"
        >
          去报名
        </van-button>
      </div>
    </van-dialog> -->
  </div>
</template>

<script>
import axios from "axios";
// import {
//   formatDate,
// } from "@/utils/generator/dateTimeConfig.js";

export default {
  name: "signIn",
  data() {
    return {
      alreadySignUp: false,
      tel: "",
      form: {
        name: "",
        phone: "",
        region: "",
        merchant_name: "",
        status: "2",
        message: "",
      },
      cascaderValue: "",
      show: false,
      alreadySignIn: false,
      baseUrl: process.env.VUE_APP_BASE_API_PURCHASE,
      dialog: false,
      searchStatus: false,
    };
  },
  mounted() {
    //格式化省市区数据
    // this.options = this.formateData(this.regionOptions);
    this.$nextTick(() => {
      this.getOpenId();
    });

    // this.getLocalInfo();
    // this.getSignInfo();
  },
  methods: {
    getRecord() {
      let url = this.baseUrl + "/api/Tasting/getSignupByOpenid";
      axios
        .post(url, { openid: this.form.openId })
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.id) {
              let data = res.data.data;
              this.currentId = data.id;
              this.form.name = data.name;
              this.form.phone = data.phone;
              this.form.merchant_name = data.merchant_name;
              this.form.member_type = data.member_type;
              this.alreadySignUp = true;
              this.alreadySignIn = data.is_sign;
            } else {
              this.alreadySignUp = false;
              this.alreadySignIn = false;
              // this.dialog = true;
            }
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(() => {
          this.$toast.fail("接口请求失败，请稍后重试");
        });
    },
    //根据手机号查询信息 兼容之前版本
    // getInfoByTel() {
    //   if (this.tel === "" || this.tel === undefined) {
    //     this.$toast.fail("手机号不能为空");
    //     return;
    //   }
    //   if (RegExp(/^1[3456789]\d{9}$/).test(this.tel)) {
    //   } else {
    //     this.$toast.fail("手机号不合法");
    //     return;
    //   }
    //   let url = this.baseUrl + "/api/Tasting/getSignupByPhone";
    //   axios
    //     .post(url, { phone: this.tel })
    //     .then((res) => {
    //       if (res.data.code == 0) {
    //         this.searchStatus = true;
    //         if (res.data.data && res.data.data.id) {
    //           let data = res.data.data;
    //           this.currentId = data.id;
    //           this.form.name = data.name;
    //           this.form.phone = data.phone;
    //           this.form.merchant_name = data.merchant_name;
    //           this.form.member_type = data.member_type;
    //           this.alreadySignUp = true;
    //           this.alreadySignIn = data.is_sign;
    //           this.dialog = false;
    //         } else {
    //           // this.alreadySignUp = false;
    //           // this.alreadySignIn = false;
    //           // this.dialog = true;
    //         }
    //       } else {
    //         this.$toast.fail(res.data.msg);
    //       }
    //     })
    //     .catch(() => {
    //       this.$toast.fail("接口请求失败，请稍后重试");
    //     });
    // },
    getOpenId() {
      let localOpendId = localStorage.getItem("signUp_openId");
      //本地是否有openId
      if (localOpendId) {
        this.form.openId = localOpendId;
        this.getRecord();
      } else {
        this.login();
      }
    },
    //hash模式下的 判断公众号截取code
    getHashSearchParam(key) {
      // const search = /(?<=#.*\?).*/.exec(location.href)?.[0];
      // const usp = new URLSearchParams(search);
      // return usp.get(key);
      // 获取所有参数
      var query = window.location.search.substring(1);
      var hash = window.location.hash.substring(1);
      // 如果锚点后面有参数，把锚点后面的参数加入到search参数中
      if (hash.indexOf("?") > -1) {
        query += "&" + hash.split("?")[1];
      }
      var key_values = query.split("&");
      var params = {};
      // 遍历参数并存入params对象
      key_values.map(function (key_val) {
        var key_val_arr = key_val.split("=");
        params[key_val_arr[0]] = key_val_arr[1];
      });
      // 如果找到了key对应的参数，返回对应值
      if (typeof params[key] != "undefined") {
        return params[key];
      }
      // 如果没找到，返回空字符串
      return "";
    },
    //wx登录
    login() {
      let openId = this.getHashSearchParam("openid");
      if (openId == null || openId === "") {
        let url =
          (window.location.host == "https://pro.scm.tysp.com"
            ? "https://pro.scm.tysp.com"
            : "http://47.108.149.12:8009") +
          "/api/wechat.base/oauth?redirect_url=" +
          encodeURIComponent(window.location.href);
        window.location.href = url;
      } else {
        this.form.openId = openId;
        localStorage.setItem("signUp_openId", openId);
        this.getRecord();
      }
    },

    //签到
    signIn() {
      if (!this.currentId) {
        return;
      }
      let url = this.baseUrl + "/api/Tasting/tastingSign";
      let params = {
        id: this.currentId,
        is_sign: 1,
        openid: this.form.openId,
      };
      axios
        .post(url, params)
        .then((res) => {
          if (res.data.code == 0) {
            this.alreadySignIn = true;
            localStorage.setItem("signUp_alreadySignIn", true);
            this.$toast.success("签到成功");
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(() => {
          this.$toast.fail("接口请求失败，请稍后重试");
        });
    },
    //获取服务端签到信息 包含round_code
    // getSignInfo() {
    //   let url = this.baseUrl + "/api/Tasting/getActiveRound";
    //   axios
    //     .get(url)
    //     .then((res) => {
    //       if (res.data.code == 0) {
    //         //本地数据与服务端返回 round_code比较 若相同说明本场签到会已经报名了
    //         if (res.data.data.round_code == this.form.round_code) {
    //           this.alreadySignUp = true;
    //         } else {
    //           this.alreadySignUp = false;
    //         }
    //       } else {
    //         this.$toast.fail(res.data.msg);
    //       }
    //     })
    //     .catch(() => {
    //       this.$toast.fail("接口请求失败，请稍后重试");
    //     });
    // },
    //获取本地缓存数据
    // getLocalInfo() {
    //   let info = localStorage.getItem("signUp_form");
    //   let currentId = localStorage.getItem("signUp_formId");
    //   let alreadySignIn = localStorage.getItem("signUp_alreadySignIn");
    //   if (info) {
    //     this.form = JSON.parse(info);
    //   }
    //   this.alreadySignIn = alreadySignIn ? true : false;
    //   console.log("form", this.form);
    //   this.currentId = currentId ? currentId : "";
    // },
    //跳转到报名页面 并携带needSignIn参数  needSignIn：true  报名后需要调用签到接口
    goSignUp() {
      this.$router.push({
        name: "Index",
        query: {
          needSignIn: true,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url(https://tysp-pro.oss-cn-chengdu.aliyuncs.com/static/wx/img/loginBack.png);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-clip: content-box;
  background-size: cover;
  overflow-y: auto;
}
.top {
  position: relative;
  left: 0;
  top: 1.28rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.42rem;
  font-weight: 700;
  color: #646566;
  margin-bottom: 2.13rem;
  .title {
    font-size: 0.53rem;
    color: #000;
  }
}

.cusBtn {
  width: 80%;
  margin: 0 auto 0.2rem;
}
.roundBtn {
  //   width: 160px;
  //   height: 160px;
  border-radius: 50%;
  //   font-size: 30px;
  position: fixed;
  //   bottom: 20px;
  bottom: 1rem;
  left: 50%;
  box-shadow: 0 0px 0.45rem rgba(0, 0, 0, 0.6);
  font-size: 0.45rem;
  width: 3.2rem;
  height: 3.2rem;
  transform: translateX(-50%);
  
  font-weight: bold;
}
.roundBtnDisAbled{
  //   width: 160px;
  //   height: 160px;
  border-radius: 50%;
  //   font-size: 30px;
  position: fixed;
  //   bottom: 20px;
  bottom: 1rem;
  left: 50%;
  // box-shadow: 0 0px 0.45rem rgba(0, 0, 0, 0.6);
  font-size: 0.45rem;
  width: 3.2rem;
  height: 3.2rem;
  transform: translateX(-50%);
  color:#038f46 !important;
  font-weight: bold;
}
.van-button--disabled{
  opacity: 1;
}
.info {
  margin: 0 auto 2rem;
  // position: relative;
  // top: 120px;
  display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  align-items: center;
  font-size: 0.42rem;
  font-weight: 700;
  color: #000;
  .userInfo {
    text-align: left;
    padding-left: 1rem;
    .signIngoTit {
      padding-left: 0.26rem;
      border-left: 4px solid #646566;
    }
    .cusColor {
      color: #646566;
    }
  }
}
.custRoundBtn {
  width: 80%;
  // position: absolute ;
  // bottom:20px;
  // left: 50%;
  // transform: translateX(-50%);
}
</style>