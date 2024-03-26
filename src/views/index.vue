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
      <div>报名表</div>
    </div>

    <div class="content">
      <van-form @submit="onSubmit" :disabled="isAlreadySubmit" ref="submitForm">
        <van-cell required>
          <template #title>
            <div class="custom-title">我是</div>
          </template>
          <van-radio-group
            v-model="form.member_type"
            direction="horizontal"
            :disabled="isAlreadySubmit"
          >
            <van-radio name="1">客户</van-radio>
            <van-radio name="2">供应商</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell required v-show="form.member_type == 1">
          <template #title>
            <div class="custom-title">状态</div>
          </template>
          <van-radio-group
            v-model="form.status"
            direction="horizontal"
            :disabled="isAlreadySubmit"
          >
            <van-radio name="2">待合作</van-radio>
            <van-radio name="1">已合作</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field
          v-model="form.name"
          name="name"
          required
          label="姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
          ref="name"
          @click="clickFocus('name')"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="电话"
          required
          :rules="[{ required: true, message: '请输入电话' }]"
          ref="phone"
          @click="clickFocus('phone')"
          type="tel"
        />
        <van-field
          v-model="form.region"
          is-link
          readonly
          label="地区"
          @click="openDialog"
          name="region"
          ref="region"
          required
          :rules="[{ required: true, message: '请选择所属区域' }]"
        />
        <van-field
          v-model="form.merchant_name"
          name="merchant_name"
          :label="form.member_type == 1 ? '商户名称' : '供应商名称'"
          ref="merchant_name"
          @click="clickFocus('merchant_name')"
        />
        <van-field
          readonly
          clickable
          label="业态"
          :value="form.commercial"
          @click="showPicker = true"
        />

        <!-- <van-field
          v-model="form.address"
          name="address"
          label="详细地址"
          required
          :rules="[{ required: true, message: '请输入详细地址' }]"
        /> -->
        <!-- <van-field
          v-model="form.status"
          name="status"
          label="合作状态"
          required
          :rules="[{ required: true, message: '请选择合作状态' }]"
        /> -->

        <van-field
          v-model="form.message"
          name="message"
          label="留言"
          ref="message"
          @click="clickFocus('message')"
        />
        <div></div>
      </van-form>
    </div>
    <div class="cusBtn" v-if="!isAlreadySubmit">
      <van-button
        round
        block
        type="info"
        native-type="submit"
        @click="clickSubmitBtn"
        >提交</van-button
      >
      <!-- <a href="alipays://">打开支付宝</a>
          <a href="weixin://">打开微信</a> -->
    </div>

    <!-- <van-button @click="goWx"> 登录 </van-button> -->
    <div class="cusBtn" v-if="isAlreadySubmit">
      <div class="title mb5"><van-icon name="success" />已报名</div>
      <div @click="resetForm" style="color: #0b80f7; font-size: 0.42rem">
        <van-icon name="replay" />重新填写
      </div>
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="show = false"
        @finish="onFinish"
      />
    </van-popup>

    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="categoryList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import axios from "axios";
import { region, categoryList } from "@/utils/generator/options.js";
// import {
//   formatDate,
// } from "@/utils/generator/dateTimeConfig.js";

export default {
  name: "Index",
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API_PURCHASE,
      form: {
        name: "",
        phone: "",
        region: "",
        merchant_name: "",
        status: "2",
        message: "",
        openId: "",
        member_type: "1",
        commercial:"",
        // address: "",
      },
      recordInviter:"",//详情中的邀请人
      inviter:"",//当前邀请人
      cascaderValue: "",
      show: false,
      showPicker:false,
      options: [],
      isAlreadySubmit: false,
      regionOptions: region,
      categoryList: categoryList,
    };
  },
  // created() {

  // },
  mounted() {
    //格式化省市区数据
    this.getOpenId();
    this.options = this.formateData(this.regionOptions);
    this.inviter = decodeURI(this.getHashSearchParam("inviteName")); //当前邀请人姓名
    console.log('inviter',this.inviter)
    this.needSignIn = this.$route.query.needSignIn;
  },
  methods: {
    onSubmit() {
      let url = this.baseUrl + "/api/Tasting/addTasting";
      let params = {
        name: this.form.name,
        phone: this.form.phone,
        merchant_name: this.form.merchant_name,
        province: this.form.province,
        city: this.form.city,
        area: this.form.area,
        // address: this.form.address,
        status: this.form.status,
        message: this.form.message,
        round_code: this.form.round_code,
        openid: this.form.openId,
        member_type: this.form.member_type,

        commercial:this.form.commercial,
        inviter:this.inviter?this.inviter:this.recordInviter?this.recordInviter:""
      };
      if (this.currentId) {
        params.id = this.currentId;
      }
      axios
        .post(url, params)
        .then((res) => {
          if (res.data.code == 0) {
            this.$toast.success("操作成功");
            this.isAlreadySubmit = true;
            this.currentId = res.data.data.id;
            localStorage.setItem("signUp_formId", this.currentId);
            localStorage.setItem("signUp_isAlreadySubmit", 1);
            localStorage.setItem("signUp_form", JSON.stringify(this.form));

            if (this.needSignIn) {
              this.signIn();
            }
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(() => {
          this.$toast.fail("接口请求失败，请稍后重试");
        });
    },
    clickSubmitBtn() {
      this.$refs.submitForm.submit();
    },
    //根据openId查询详情
    getRecord() {
      let url = this.baseUrl + "/api/Tasting/getSignupByOpenid";
      axios
        .post(url, { openid: this.form.openId })
        .then((res) => {
          if (res.data.code == 0) {
            if (res.data.data && res.data.data.id) {
              let data = res.data.data;
              this.form.area = data.area;
              this.form.city = data.city;
              this.form.merchant_name = data.merchant_name;
              this.form.message = data.message;
              this.form.name = data.name;
              this.form.openId = data.openId;
              this.form.phone = data.phone;
              this.form.province = data.province;
              this.form.region =
                data.province + "/" + data.city + "/" + data.area;
              this.form.round_code = data.round_code;
              this.form.status = data.status + "";
              this.form.member_type = data.member_type + "";

              this.form.commercial=data.commercial;//业态
              this.recordInviter=data.inviter;

              this.isAlreadySubmit = true;

              this.currentId = data.id;
            } else {
              this.isAlreadySubmit = false;
            }

            // this.form.area=''
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(() => {
          this.$toast.fail("接口请求失败，请稍后重试");
        });
    },
    getOpenId() {
      let localOpendId = localStorage.getItem("signUp_openId");
      //本地是否有openId
      if (localOpendId) {
        this.form.openId = localOpendId;
        this.getRecord();
      } else {
        // this.login();
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
      let openId = decodeURI(this.getHashSearchParam("openid")); //openId
      
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
    // getSignInfo() {
    //   let url = this.baseUrl + "/api/Tasting/getActiveRound";
    //   axios
    //     .get(url)
    //     .then((res) => {
    //       if (res.data.code == 0) {
    //         this.round_code = res.data.data.round_code;
    //         if (this.round_code != this.form.round_code) {
    //           this.resetForm();
    //           this.currentId = "";
    //         }
    //       } else {
    //         this.$toast.fail(res.data.msg);
    //       }
    //     })
    //     .catch(() => {
    //       this.$toast.fail("接口请求失败，请稍后重试");
    //     });
    // },
    // getLocalInfo() {
    //   let info = localStorage.getItem("signUp_form");
    //   let currentId = localStorage.getItem("signUp_formId");
    //   let isAlreadySubmit = localStorage.getItem("signUp_isAlreadySubmit");
    //   if (info) {
    //     this.form = JSON.parse(info);
    //   }
    //   this.isAlreadySubmit = isAlreadySubmit ? true : false;
    //   this.currentId = currentId ? currentId : "";
    // },
    //格式化省市区
    formateData(data) {
      let newArr = [];
      for (var index = 0; index < data.length; index++) {
        data[index].value = data[index].i;
        data[index].text = data[index].n;
        if (data[index].p == 0) {
          data[index].children = [];
          newArr.push(data[index]);
        }
      }
      for (var i = 0; i < data.length; i++) {
        let findItem = newArr.find((item) => item.i == data[i].p);
        data[i].children = [];
        if (findItem) {
          findItem.children.push(data[i]);
        }
      }
      newArr.map((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.map((items) => {
            let findItems = data.filter((items1) => items1.p == items.i);
            if (findItems && findItems.length > 0) {
              findItems.map((i) => {
                if (i.children) {
                  delete i.children;
                }
              });
              items.children.push(...findItems);
            }
          });
        }
      });
      //四川51、重庆50、云南53、贵州52

      let SiChuanItem = newArr.find((item) => item.value == 51);
      let ChongQingItem = newArr.find((item) => item.value == 50);
      // let GuiZhouItem=newArr.find(item=>item.value==52);
      // let YunNanItem=newArr.find(item=>item.value==53);

      let newArrList = newArr.filter(
        (item) => item.value > 51 || item.value < 50
      );

      if (SiChuanItem && ChongQingItem) {
        newArrList = [SiChuanItem, ChongQingItem, ...newArrList];
      }
      return newArrList || newArr;
    },
    //重置表单
    resetForm() {
      this.form = {
        name: "",
        phone: "",
        region: "",
        merchant_name: "",
        status: "2",
        message: "",
        round_code: this.round_code,
        openId: localStorage.getItem("signUp_openId"),
        member_type: "1",
        commercial:"",
      };

      this.isAlreadySubmit = false;
    },

    signIn() {
      let url = this.baseUrl + "/api/Tasting/tastingSign";
      let params = {
        id: this.currentId,
        is_sign: 1,
      };
      axios
        .post(url, params)
        .then((res) => {
          if (res.data.code == 0) {
            localStorage.setItem("signUp_alreadySignIn", true);
            this.$router.push({
              name: "signIn",
            });
          } else {
            this.$toast.fail(res.data.msg);
          }
        })
        .catch(() => {
          this.$toast.fail("接口请求失败，请稍后重试");
        });
    },
    onFinish({ selectedOptions }) {
      this.show = false;
      this.form.region = selectedOptions.map((option) => option.text).join("/");
      this.form.province = selectedOptions[0].text;
      this.form.city = selectedOptions[1].text;
      this.form.area = selectedOptions[2].text;
    },
    onConfirm(value){
      this.form.commercial = value;
      this.showPicker = false
    },
    openDialog() {
      if (this.isAlreadySubmit) {
        return;
      }
      this.show = true;
    },
    clickFocus(ref) {
      this.$refs[ref].focus();
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
}

.content {
  // position: relative;
  // top: 2.13rem;
  width: 80%;
  margin: 0 auto 1rem;
  .van-cell {
    background-color: transparent;
    font-size: 0.42rem;
    margin-bottom: 0.2rem;
    line-height: 0.64rem;
  }
  .van-cell::after {
    border-bottom: 1px solid #000;
  }
  .van-cell__title {
    flex: none;
    width: 26%;
    text-align: right;
  }

  .van-cell__value {
    width: 74%;
    text-align: left;
    line-height: 0.64rem;
  }
  .van-form ::v-deep {
    .van-field--disabled .van-field__label,
    .van-field__control:disabled {
      color: #000 !important;
      -webkit-text-fill-color: #000 !important;
    }
  }
  .van-radio-group--horizontal {
    height: 100%;
  }
  .custom-title {
    text-align: left;
  }
}
.cusBtn {
  // position: absolute;
  // bottom: .5rem;
  // left: 50%;
  // transform: translateX(-50%);

  width: 80%;
  margin: 0 auto 0.2rem;
}
.title {
  font-size: 0.53rem;
  color: #000;
}
</style>