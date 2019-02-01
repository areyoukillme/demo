
<template>
  <div>
    <input
      type="file"
      style="opacity:0;"
      :style="inputStyle"
      :multiple="multiple"
      accept="image/*"
      @change="uploadImg($event)"
    >
  </div>
</template>
<script>
import { EXIF } from "../../config/exif.js";
export default {
  props: {
    sourceImg: {
      type: Array,//已选择的图片
			default: function () {
        return []
    }
    },
    multiple: {
      //是否可以多上传
      type: Boolean,
      default: false
    },
    imgNumLimit: {
      //一次最多可以上传多少张照片
      type: Number,
      default: 4
    },
    inputStyle: {
      //input样式
      type: Object
    }
  },
  data() {
    return {
      imgArr: []
    };
  },
  methods: {
    uploadImg(e) {
      let _this = this;
      _this.imgArr = []; //图片数据清零
      _this.imgArr = [..._this.imgArr,..._this.sourceImg];
      let tag = e.target;
      let fileList = tag.files;
      let imgNum = fileList.length;
      if (imgNum > this.imgNumLimit) {
        this.$toast("最多选择" + this.imgNumLimit + "张图片！", 1500);
        imgNum = this.imgNumLimit;
      }
      var Orientation;
      for (let i = 0; i < imgNum; i++) {
        EXIF.getData(fileList[i], function() {
          Orientation = EXIF.getTag(fileList[i], "Orientation");
        });
        let reader = new FileReader();
        reader.readAsDataURL(fileList[i]);
        reader.onload = function() {
          var oReader = new FileReader();
          oReader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function() {
              var expectWidth = this.naturalWidth;
              var expectHeight = this.naturalHeight;
              if (
                this.naturalWidth > this.naturalHeight &&
                this.naturalWidth > 800
              ) {
                expectWidth = 800;
                expectHeight =
                  (expectWidth * this.naturalHeight) / this.naturalWidth;
              } else if (
                this.naturalHeight > this.naturalWidth &&
                this.naturalHeight > 1200
              ) {
                expectHeight = 1200;
                expectWidth =
                  (expectHeight * this.naturalWidth) / this.naturalHeight;
              }
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              canvas.width = expectWidth;
              canvas.height = expectHeight;
              ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
              var base64 = null;
              //修复ios上传图片的时候 被旋转的问题
              if (Orientation != "" && Orientation != 1) {
                switch (Orientation) {
                  case 6: //需要顺时针（向左）90度旋转
                    _this.rotateImg(this, "left", canvas);
                    break;
                  case 8: //需要逆时针（向右）90度旋转
                    _this.rotateImg(this, "right", canvas);
                    break;
                  case 3: //需要180度旋转
                    _this.rotateImg(this, "right", canvas); //转两次
                    _this.rotateImg(this, "right", canvas);
                    break;
                }
              }
              base64 = canvas.toDataURL("image/jpeg", 0.5); //压缩图片质量
              if (fileList[i].size / 1024000 > 1) {
                _this.imgScale(base64, 4);
				
              } else {
                _this.imgArr.push({ src: base64 });
				_this.$emit("getImg", _this.imgArr)
              }
							
            };
			
          };
          oReader.readAsDataURL(fileList[i]);
					
        };
		
      }
      
      this.$emit('getNum',imgNum);
    },
    //缩放
    imgScale: function(imgUrl, quality) {
      let img = new Image();
      let _this = this;
      let canvas = document.createElement("canvas");
      let cxt = canvas.getContext("2d");
      img.src = imgUrl;
      img.onload = function() {
        //缩放后图片的宽高
        let width = img.naturalWidth / quality;
        let height = img.naturalHeight / quality;
        canvas.width = width;
        canvas.height = height;
        cxt.drawImage(this, 0, 0, width, height);
        _this.imgArr.push({ src: canvas.toDataURL("image/jpeg") });
		_this.$emit("getImg", _this.imgArr)
      };
    },
    //旋转
    rotateImg: function(img, direction, canvas) {
      //图片旋转
      var min_step = 0;
      var max_step = 3;
      if (img == null) return;
      var height = img.height;
      var width = img.width;
      var step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      var degree = (step * 90 * Math.PI) / 180;
      var ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    }
  }
};
</script>
