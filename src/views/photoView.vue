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
  <div class="container">
    <div ref="imageTofile" class="virtualImgContainer">
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
                >{{ currentImgInfo.FocalLengthIn35mmFilm }}mm f/{{
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
    </div>

    <div class="imgContainer">
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
                >{{ currentImgInfo.FocalLengthIn35mmFilm }}mm f/{{
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
    </div>

    <img v-show="isShow" :src="htmlUrl" alt="" />

    <van-uploader :after-read="afterRead" :before-read="beforeRead">
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader>
    <van-button @click="imgTofile">生成图片</van-button>
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
      currentImgUrl: "",
      currentImgInfo: null,
      isShow: false,
      htmlUrl: "",
      canvasImgUrl: "",
      renderOldImgXSize: "",
      renderOldImgYSize: "",
    };
  },
  // created() {

  // },
  mounted() {},
  methods: {
    //上传前
    beforeRead(file) {
      alert(file.type);
      if (file.type !== "image/jpeg") {
        Toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    //上传后
    afterRead(file) {
      console.log("file", file);
      this.currentImgUrl = file.content;
      let that = this;
      EXIF.getData(file.file, function () {
        console.log("getData", this);
        // 这里面可以看到值，想要什么直接获取即可。
        let currentImgInfo = EXIF.getAllTags(this);
        console.log("currentImgInfo", currentImgInfo);
        that.currentImgInfo = currentImgInfo;
      });
    },
    imgTofile() {
      let renderDom = this.$refs.imageTofile;
      let width = renderDom.offsetWidth;
      let height = renderDom.offsetHeight;

      let max = Math.max(width, height);
      let scale = parseInt(4000 / max);
      console.log("width", width, height);

      console.log("scale", scale);

      html2canvas(this.$refs.imageTofile, {
        backgroundColor: "#fff",
        scale: scale,
        // width: width*scale,
        // height:height*scale
      })
        .then((canvas) => {
          let url = canvas.toDataURL("image/png");
          this.htmlUrl = url;
          this.$nextTick(() => {
            this.isShow = true;
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
.container {
  > div.virtualImgContainer {
    position: absolute;
    top: -9999px;
    left: -9999px;
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