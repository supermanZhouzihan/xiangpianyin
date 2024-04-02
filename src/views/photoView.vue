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
    <div
      style="
        width: 94%;
        background-color: rgb(33, 33, 33);
        margin: 0 auto;
        padding: 0.5rem;
        box-sizing: border-box;
        margin-bottom: 10px;
      "
    >
      <van-uploader
        :after-read="afterRead"
        :before-read="beforeRead"
        multiple
        :max-size="40 * 1024 * 1024"
        @oversize="onOversize"
        :max-count="4"
      >
        <van-button round color="rgb(241,241,241)" class="uploadBtn">
          上传照片
        </van-button>
      </van-uploader>
    </div>
    <div class="exampleList">
      <img
        src="../assets/example.jpg"
        style="width: 100%; margin-bottom: 10px"
        alt=""
      />
      <img
        src="../assets/example.jpg"
        style="width: 100%; margin-bottom: 10px"
        alt=""
      />
      <img
        src="../assets/example.jpg"
        style="width: 100%; margin-bottom: 10px"
        alt=""
      />
    </div>
    <div v-if="currentImgInfo && currentImgInfo.length > 0" style="width:100%">
      <div v-for="item in currentImgInfo" :key="item.index" style="width:100%">
        <div :ref="'imageTofile' + item.index" class="virtualImgContainer">
          <img :src="item.imgUrl" alt="" class="cusimg" />
          <div class="imginfo" v-if="item">
            <div class="text-left">
              <div>{{ item.Model }}</div>
              <div class="textBottom">{{ item.DateTime }}</div>
            </div>

            <div class="text-left flexBetween" style="align-items: center">
              <div class="makeLogo">
                <img src="../assets/logo.png" alt="" style="width: 0.5rem" />
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

    <img v-for="item in htmlUrl" v-show="isShow" :src="item" :key="item.index" alt="" />

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
    <van-button @click="batchTofile">生成图片</van-button>
    <!-- <van-button @click="downloadImage">生成图片</van-button> -->
  </div>
</template>

<script>
import EXIF from "exif-js";
import html2canvas from "html2canvas";

export default {
  name: "PhotoView",
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API_PURCHASE,
      // currentImgUrlList: [],
      currentImgInfo: [],
      isShow: false,
      htmlUrl: [],
      canvasImgUrl: "",
      renderOldImgXSize: "",
      renderOldImgYSize: "",
    };
  },
  // created() {

  // },
  mounted() {
    this.getOpenId()
  },
  methods: {
    //上传前
    beforeRead(file) {
      // alert(file.type);
      console.log("file", file);
      if (Array.isArray(file)) {
        let fileList = file;
        let findNoJpgPng = fileList.find(
          (item) => item.type !== "image/jpeg" && item.type !== "image/png"
        );
        if (findNoJpgPng) {
          alert("请上传 jpg / png格式图片");
          return false;
        }
      } else {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          console.log(file.type, "image/png");
          alert("请上传 jpg / png格式图片");
          return false;
        }
      }

      return true;
    },
    //上传后
    afterRead(file) {
      console.log("file", file);
      this.currentImgInfo = [];
      //多个文件
      if (Array.isArray(file)) {
        file.forEach((item, index) => {
          console.log("item", item);
          this.getExifData(item, index);
          // this.currentImgUrl = file.content;
          // this.currentImgUrlList.push(item.content);
        });
      } else {
        this.getExifData(file, 0);
        // this.currentImgUrlList.push(file.content);
      }
      // console.log("list", this.currentImgUrlList);
    },
    getExifData(file, index) {
      //单个文件
      let that = this;
      EXIF.getData(file.file, function () {
        console.log("getData", this);
        // 这里面可以看到值，想要什么直接获取即可。
        let currentImgInfo = EXIF.getAllTags(this);
        console.log("currentImgInfo", currentImgInfo);
        currentImgInfo.imgUrl = file.content;
        currentImgInfo.index = index;
        that.currentImgInfo.push(currentImgInfo);
        console.log("currentInfo", that.currentImgInfo);
      });
    },
    batchTofile(){
      this.htmlUrl=[];
      this.currentImgInfo.map((item)=>{
        let ref='imageTofile'+[item.index];
        this.imgTofile(ref);
      })
    },
    imgTofile(ref) {
      console.log('ref',ref)
      let renderDom =this.$refs[ref][0];
      console.log('rederDom',renderDom)
      let width = renderDom.offsetWidth;
      let height = renderDom.offsetHeight;

      console.log('width',width)
      console.log('height',height)

      let max = Math.max(width, height);
      let scale = parseInt(4000 / max);
      console.log("width", width, height);

      console.log("scale", scale);

      html2canvas(this.$refs[ref][0], {
        backgroundColor: "#fff",
        scale: scale,
        // width: width*scale,
        // height:height*scale
      })
        .then((canvas) => {
          let url = canvas.toDataURL("image/png");
          this.htmlUrl.push(url);
          this.$nextTick(() => {
            this.isShow = true;
          });
        })
        .catch((err) => {
          console.log(err);
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

    getOpenId() {
      let localOpendId = localStorage.getItem("wx_openId");
      //本地是否有openId
      if (localOpendId) {
        this.wx_openId = localOpendId;
        // this.getRecord();
      } else {
        this.login();
      }
    },
    //wx登录
    login() {
      let openId = this.getHashSearchParam("openid");
      if (openId == null || openId === "") {
        let url =
          (window.location.host == "https://www.xiangpianyin.com"
            ? "https://www.xiangpianyin.com"
            : "http://47.109.184.216:1234") +
          "/api/wechat.base/oauth?redirect_url=" +
          encodeURIComponent(window.location.href);
        window.location.href = url;
      } else {
        this.wx_openId = openId;
        localStorage.setItem("wx_openId", openId);
        // this.getRecord();
      }
    },
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
    width: 100%;
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
}
</style>