import { axios } from "./env";

const fetchImage = (event,tokenId,self) =>{
//   self.$indicator.open({
//     spinnerType: "double-bounce"
//   });//开启min-ui的loading
console.log(event[0])
  return new Promise((resolve, reject) => {
    let formData = new FormData();
	
    event.forEach(element => {
      let file;
			console.log(element.src)
      file = dataURLtoBlob(element.src);
      formData.append("files", file);
    });
    formData.append("fileName", "farm/im/");
    axios({
      headers: { "Content-Type": "multipart/form-data", token: tokenId },
      method: "post",
      url: "/farm-im/api/upload.json",
      data: formData
    })
      .then(res => {
        // self.$indicator.close();//关闭min-ui的loading
        let data = res.data;
        if (data.code == 0) {
          let webImgList
           webImgList = data.list
          resolve(webImgList);
        } else {
          self.$toast(data.msg, 1500);
        }
      })
      .catch(error => {
        reject(error)
      });
  });
},
//base64转化blob对象
 dataURLtoBlob=(dataurl)=> {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export default fetchImage;