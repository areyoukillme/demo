//手机号校验
export const isMobile=(str)=>{
    if(str==null||str=="") return false;
    let result = str.match("^(13[0-9]|14[1|4|5|6|7|8]|15[0|1|2|3|5|6|7|8|9]|166|17[0|1|3|5|6|7|8]|18[0-9]|19[8|9])\\d{8}$");
    if(result==null)return false;
    return true;
};
//非空校验
export const isRequired=(str)=>{
    if(str==null||str=="") return false;
    return true;
};

//6-16位数字和字母密码验证
export const isPassWord=(str)=>{
    if(str==null||str=="") return false;
    let result=str.match(/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,16}$/);
    if(result==null)return false;
    return true;
};

//校验是否为两位小数
export const isNum = (str) => {
    if (str == null || str == "") return false;
    let result = str.match(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
    if (result == null) return false;
    return true;
};

export const isCardNo=(card)=> {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (reg.test(card)) {
        return true;
    }
}


//正整数校验
export const isParseint = (str) => {
    if (str == null || str == "") return false;
    let result = str.match(/^(0*?[1-9][0-9]*)$/);
    if (result == null) return false;
    return true;
};