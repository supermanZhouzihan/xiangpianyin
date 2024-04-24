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
  <div class="photoViewContainer">
    <div class="title">你好，摄影师！</div>
    <div style="width: 100%; box-sizing: border-box; margin-bottom: 10px">
      <van-uploader
        :after-read="afterRead"
        :before-read="beforeRead"
        :multiple="multiple"
        :max-size="40 * 1024 * 1024"
        @oversize="onOversize"
        :max-count="8"
      >
        <div
          style="
            width: 94%;
            background-color: rgb(33, 33, 33);
            margin: 0 auto 0.2rem;
            padding: 0.5rem 0;
          "
        >
          <van-button round color="rgb(241,241,241)" class="uploadBtn">
            上传照片
          </van-button>
        </div>
        <div class="exampleList">
          <img
            src="https://shejiayu.oss-cn-chengdu.aliyuncs.com/app/1783128721898229761.png?x-oss-process=image/resize,m_lfit,w_800"
            style="width: 100%; margin-bottom: 10px"
            alt=""
          />
          <img
            src="https://shejiayu.oss-cn-chengdu.aliyuncs.com/app/1783128489013694465.png?x-oss-process=image/resize,m_lfit,w_800"
            style="width: 100%; margin-bottom: 10px"
            alt=""
          />
          <img
            src="https://shejiayu.oss-cn-chengdu.aliyuncs.com/app/1783127305578237953.png?x-oss-process=image/resize,m_lfit,w_800"
            style="width: 100%; margin-bottom: 10px"
            alt=""
          />
        </div>
      </van-uploader>
    </div>
    <div
      v-if="currentImgInfo && currentImgInfo.length > 0"
      style="width: 100%"
      class="virtualCanvasDom"
    >
      <div v-for="item in currentImgInfo" :key="item.index" style="width: 100%">
        <div :ref="'imageTofile' + item.index" class="virtualImgContainer">
          <img :src="item.imgUrl" alt="" class="cusimg" @load="imgLoaded" />
          <div class="imginfo" v-if="item">
            <div class="text-left">
              <div>{{ item.Model }}</div>
              <div class="textBottom">{{ item.DateTime }}</div>
            </div>

            <div class="text-left flexBetween" style="align-items: center">
              <div class="makeLogo">
                <!-- <img :src="`../assets/logo/${item.Make?item.Make:'default'}.png`" alt="" style="width: 0.5rem" /> -->
                <img src="../assets/logo/default.png" alt="" style="width: 1.5rem" />
              </div>
              <div>
                <div>
                  <span v-if="item.ExposureTime"
                    >{{ item.FocalLength }}mm f/{{ item.FNumber }}
                    {{
                      reduceFraction(
                        item.ExposureTime.numerator,
                        item.ExposureTime.denominator
                      )
                    }}
                    ISO{{ item.ISOSpeedRatings }}</span
                  >
                </div>
                <div v-if="item.GPSLongitude" class="textBottom">
                  {{
                    item.GPSLatitude[0] +
                    "°" +
                    item.GPSLatitude[1] +
                    "′" +
                    item.GPSLatitude[2] +
                    "″N"
                  }}
                  {{
                    item.GPSLongitude[0] +
                    "°" +
                    item.GPSLongitude[1] +
                    "′" +
                    item.GPSLongitude[2] +
                    "″E"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="imgContainer">
      <img :src="currentImgUrl" alt="" class="cusimg" />
      <div class="imginfo" v-if="currentImgInfo">
        <div class="text-left">
          <div>{{ currentImgInfo.Model }}</div>
          <div class="textBottom">{{ currentImgInfo.DateTime }}</div>
        </div>

        <div class="text-left flexBetween" style="align-items: center">
          <div class="makeLogo">
            <img src="../assets/logo.png" alt="" style="width: 0.5rem" />
          </div>
          <div>
            <div>
              <span v-if="currentImgInfo.ExposureTime"
                >{{ currentImgInfo.FocalLength }}mm f/{{
                  currentImgInfo.FNumber
                }}
                {{
                  reduceFraction(
                    currentImgInfo.ExposureTime.numerator,
                    currentImgInfo.ExposureTime.denominator
                  )
                }}
                ISO{{ currentImgInfo.ISOSpeedRatings }}</span
              >
            </div>
            <div v-if="currentImgInfo.GPSLongitude" class="textBottom">
              {{
                currentImgInfo.GPSLatitude[0] +
                "°" +
                currentImgInfo.GPSLatitude[1] +
                "′" +
                currentImgInfo.GPSLatitude[2] +
                "″N"
              }}
              {{
                currentImgInfo.GPSLongitude[0] +
                "°" +
                currentImgInfo.GPSLongitude[1] +
                "′" +
                currentImgInfo.GPSLongitude[2] +
                "″E"
              }}
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <img
      v-for="item in htmlUrl"
      v-show="isShow"
      :src="item"
      :key="item.index"
      v-lazy="item"
      alt=""
    />

    <!-- <van-uploader
      :after-read="afterRead"
      :before-read="beforeRead"
      multiple
      :max-size="40 * 1024 * 1024"
      @oversize="onOversize"
      :max-count="2"
    >
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader> -->
    <!-- <van-button @click="batchTofile">生成图片</van-button>  -->
    <!-- <van-button @click="downloadImage">生成图片</van-button> -->
  </div>
</template>

<script>
import EXIF from "exif-js";
import axios from "axios";
import html2canvas from "html2canvas";

export default {
  name: "PhotoView",
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      // currentImgUrlList: [],
      currentImgInfo: [],
      isShow: false,
      htmlUrl: [],
      canvasImgUrl: "",
      renderOldImgXSize: "",
      renderOldImgYSize: "",
      batchId: "",
      currentImgInfoLength: 0,
      openId: "",
      count: 0,
      multiple:false //是否可以多选
    };
  },
  // created() {

  // },
  mounted() {
    this.getOpenId();
    // console.log(this,this.$toast)
  },

  methods: {
    getOpenId() {
      let openId = this.getHashSearchParam("openId");
      if (openId) {
        this.openId = openId;
      } else {
        this.openId = "";
      }
    },

    //上传前
    beforeRead(file) {
      console.log("beforeRead---------------------file", file);
      console.time("计时器0");

      // Toast.loading({
      //   message: '加载中...',
      //   duration: 0,
      //   forbidClick: true
      // });

      // console.log(this.this.$toast)

      this.$toast({
        type: "loading",
        message: "加载中...",
        duration: 0,
        forbidClick: true,
        overlay: true,
      });

      if (Array.isArray(file)) {
        let fileList = file;
        let findNoJpgPng = fileList.find(
          (item) => item.type !== "image/jpeg" && item.type !== "image/png"
        );
        if (findNoJpgPng) {
          alert("请上传 jpg / png格式图片");
          this.$toast.clear();
          return false;
        }
      } else {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          alert("请上传 jpg / png格式图片");
          this.$toast.clear();
          return false;
        }
      }

      return true;
    },
    //上传后
    afterRead(file) {
      console.log("afterRead---------------file", file);
      this.currentImgInfo = [];
      this.count = 0;

      //多个文件
      if (Array.isArray(file)) {
        this.currentImgInfoLength = file.length;
        file.forEach((item, index) => {
          this.getExifData(item, index);
        });
      } else {
        this.getExifData(file, 0);
        this.currentImgInfoLength = 1;
      }
      console.timeEnd("计时器0");
      console.time("计时器1");
    },
    getExifData(file, index) {
      //单个文件
      let that = this;
      EXIF.getData(file.file, function () {
        // 这里面可以看到值，想要什么直接获取即可。
        let currentImgInfo = EXIF.getAllTags(this);
        currentImgInfo.imgUrl = file.content;
        console.log("file", file);
        currentImgInfo.index = index;
        that.currentImgInfo.push(currentImgInfo);
        console.log('读出来的数据',currentImgInfo)
        // if (that.currentImgInfo.length == that.currentImgInfoLength) {
        //   // that.$toast.clear();

        //   that.$nextTick(() => {
        //     console.timeEnd("计时器1");
        //     that.batchTofile();

        //   })
        // }
      });
    },

    imgLoaded() {
      this.count++;
      if (this.count == this.currentImgInfoLength) {
        this.batchTofile();
      }
    },
    batchTofile() {
      this.htmlUrl = [];
      console.log("执行了");
      console.time("计时器2");
      // this.$toast({
      //   type:'loading',
      //   message:'加载中...',
      //   duration:0,
      //   forbidClick:true,
      //   overlay:true
      // })

      this.currentImgInfo.forEach((item) => {
        let ref = "imageTofile" + [item.index];
        this.imgTofile(ref);
      });
    },
    imgTofile(ref) {
      console.log(ref);
      let renderDom = this.$refs[ref][0];
      let width = renderDom.offsetWidth;
      let height = renderDom.offsetHeight;
      console.log(width, height);

      let max = Math.max(width, height);
      let scale = parseInt(4000 / max);
      html2canvas(this.$refs[ref][0], {
        backgroundColor: "#fff",
        scale: scale,
        // width: width*scale,
        // height:height*scale
      })
        .then((canvas) => {
          let imgUrl = canvas.toDataURL("image/png");
          this.htmlUrl.push(imgUrl);
          if (this.htmlUrl.length == this.currentImgInfo.length) {
            console.timeEnd("计时器2");
            let params = {
              openId: this.openId,
              picList: [
                {
                  type: "png",
                  num: this.htmlUrl.length,
                },
              ],
            };
            let ossUploadUrl = this.baseUrl + "/back/createOssUploadUrl";
            axios
              .post(ossUploadUrl, params)
              .then((res) => {
                if (res.data.code == 1) {
                  let list = res.data.data.urlList[0].url;
                  this.batchId = res.data.data.batchId;
                  let ossStatus = [];
                  // 循环上传oss
                  console.time("计时器3");
                  console.log("执行了11111111111", list);

                  for (let i = 0; i < list.length; i++) {
                    axios
                      .put(list[i], this.base64ToFile(this.htmlUrl[i]), {
                        headers: {
                          "Content-Type": "application/octet-stream",
                        },
                      })
                      .then((res) => {
                        ossStatus.push(res.status);
                        if (ossStatus.length == list.length) {
                          console.timeEnd("计时器3");
                          console.log("ossStatus", ossStatus);
                          let reportUrl = this.baseUrl + "/back/reportUpload";
                          let findHaveFail = ossStatus.find(
                            (item) => item != 200
                          ); //是否有上传失败的
                          console.log("进这里2findHaveFail", findHaveFail);
                          console.time("计时器4");
                          axios
                            .post(reportUrl, {
                              batchId: this.batchId,
                              code: findHaveFail ? -1 : 1,
                              openId: this.openId,
                            })
                            .then((res) => {
                              console.timeEnd("计时器4");
                              this.$dialog.alert({
                                title:"温馨提示",
                                message: "水印照片已合成完毕，请返回公众号进行查看"
                              });
                              this.$toast.clear();
                            });
                        }
                      })
                      .catch((err) => {
                        this.$toast.clear();
                        this.$toast({
                          type: "fail",
                          message: "上传失败，请稍后重试1",
                        });
                      });
                  }
                } else {
                  this.$toast({
                    type: "fail",
                    message: res.message,
                  });
                }
              })
              .catch((err) => {
                this.$toast.fail(`上传失败，请稍后重试2${err}`);
              });
          }
          // this.$nextTick(() => {
          //   this.isShow = true;
          // });
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },
    onOversize(file) {
      console.log(file);
      alert("文件大小不能超过 40mb");
    },
    base64ToFile: function (urlData, fileName) {
      let arr = urlData.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = atob(arr[1]);
      let n = bytes.length;
      let ia = new Uint8Array(n);
      while (n--) {
        ia[n] = bytes.charCodeAt(n);
      }
      return new File([ia], fileName, { type: mime });
    },
    drawImage(imgUrl) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        // 绘制图片
        ctx.drawImage(image, 0, 0);

        ctx.fillStyle = "red";
        ctx.fillRect(10, 10, 50, 50);
      };

      image.src = imgUrl; // 替换为你的图片路径
    },
    //找到分子分母的最大公约数
    findGCD(num1, num2) {
      while (num2 !== 0) {
        var temp = num2;
        num2 = num1 % num2;
        num1 = temp;
      }
      return num1;
    },
    //分子分母到最简形式 numerator分子 denominator分母
    reduceFraction(numerator, denominator) {
      var gcd = this.findGCD(numerator, denominator);
      return numerator / gcd + "/" + denominator / gcd;
    },

    // getOpenId() {
    //   let localOpendId = localStorage.getItem("wx_openId");
    //   //本地是否有openId
    //   if (localOpendId) {
    //     this.wx_openId = localOpendId;
    //     // this.getRecord();
    //   } else {
    //     this.login();
    //   }
    // },
    //wx登录
    // login() {
    //   let openId = this.getHashSearchParam("openid");
    //   if (openId == null || openId === "") {
    //     let url =
    //       (window.location.host == "https://www.xiangpianyin.com"
    //         ? "https://www.xiangpianyin.com"
    //         : "http://47.109.184.216:1234") +
    //       "/api/wechat.base/oauth?redirect_url=" +
    //       encodeURIComponent(window.location.href);
    //     window.location.href = url;
    //   } else {
    //     this.wx_openId = openId;
    //     localStorage.setItem("wx_openId", openId);
    //     // this.getRecord();
    //   }
    // },
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
    // downloadImage() {
    //   const canvas = this.$refs.canvas;
    //   const dataURL = canvas.toDataURL("image/jpeg", 1.0);

    //   const link = document.createElement("a");
    //   link.href = dataURL;
    //   this.canvasImgUrl = dataURL;
    //   link.download = "my-image.jpeg";
    //   link.click();
    // },
  },
};
</script>

<style lang="scss" scoped>
.photoViewContainer {
  font-size: 0.42rem;
  background-color: black;

  .title {
    text-align: left;
    padding: 0.42rem 1rem;
    color: #fff;
  }

  .cusUpload.van-uploader ::v-deep {
    width: 100%;

    .van-uploader__wrapper {
      width: 100%;

      .van-uploader__input-wrapper {
        width: 100%;
      }
    }
  }

  .uploadBtn {
    width: 90%;
    color: rgb(0, 0, 0) !important;
    font-size: 0.6rem;
    padding: 0.6rem;
  }

  .exampleList {
    width: 92%;
    margin: 0 auto;
  }

  div.virtualImgContainer {
    // position: absolute;
    // top: -9999px;
    // left: -9999px;
    width: 100%;

    .cusimg {
      width: 100%;
    }

    .imginfo {
      width: 100%;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      box-sizing: border-box;
      font-weight: 700;

      .makeLogo {
        padding:4px 10px;

        img {
          border-right: 1px solid #ccc;
          padding-right: 10px;
        }
      }

      .textBottom {
        font-size: 0.26rem;
        color: #ccc;
        font-weight: 500;
      }
    }
  }

  > div.imgContainer {
    width: 80%;
    margin: 0 auto;

    .cusimg {
      width: 100%;
    }

    .imginfo {
      width: 100%;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.3rem;
      box-sizing: border-box;
      font-weight: 700;

      .makeLogo {
        padding: 10px;

        img {
          border-right: 1px solid #ccc;
          padding-right: 10px;
        }
      }

      .textBottom {
        font-size: 0.26rem;
        color: #ccc;
        font-weight: 500;
      }
    }
  }

  .virtualCanvasDom {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
}
</style>