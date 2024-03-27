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
        <div ref="imageTofile" class="imgContainer">
            <img :src="currentImgUrl" alt="" class="cusimg">
            <div class="imginfo">
                <div>
                    <div>{{ currentImgInfo.Model }}</div>
                    <div>{{ currentImgInfo.DateTime }}</div>
                </div>
                <div class="makeLogo">
                    <img src="../assets/logo.png" alt="" style="width:30px">
                </div>
                <div>
                    <div>
                        <span>113mm f/1.6 1/170 ISO500</span>
                    </div>
                    <div>
                        30°13′32″N 120°30′12″N
                    </div>
                </div>
            </div>
        </div>
        <img v-show="isShow" :src="htmlUrl" style="width:400px" alt="" />

        <van-uploader :after-read="afterRead" :before-read="beforeRead">
            <van-button icon="plus" type="primary">上传文件</van-button>
        </van-uploader>
        <van-button @click="imgTofile">生成图片</van-button>
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
            currentImgInfo: {},
            isShow: false,
            htmlUrl: ""

        };
    },
    // created() {

    // },
    mounted() {

    },
    methods: {
        //上传前
        beforeRead(file) {
            if (file.type !== 'image/jpeg') {
                Toast('请上传 jpg 格式图片');
                return false;
            }
            return true;
        },
        //上传后
        afterRead(file) {
            console.log('file', file)
            this.currentImgUrl = file.content
            let that = this;
            EXIF.getData(file.file, function () {
                console.log('getData', this);
                // 这里面可以看到值，想要什么直接获取即可。
                // console.log('getAllTags', EXIF.getAllTags(this));
                let currentImgInfo = EXIF.getAllTags(this);
                console.log('currentImgInfo', currentImgInfo)
                that.currentImgInfo = currentImgInfo;




            });
        },
        imgTofile() {
            let width ="";
            let height =""
            html2canvas(this.$refs.imageTofile, {
                backgroundColor: null,
                // width:"331.2",
                // height:"316.8"
            }).then((canvas) => {
                let url = canvas.toDataURL("image/png");
                this.htmlUrl = url;
                this.isShow = true;
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

    },
};
</script>

<style lang="scss" scoped>
.container {
    width: 80%;
    margin: 0 auto;
   >div.imgContainer{
    .cusimg {
        width: 100%;
    }

    .imginfo {
        width: 100%;
        padding: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .4rem;

    }
   }
    
}
</style>