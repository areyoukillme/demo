<template>
  <div class="trading common-inner">
    <h1>{{webname}}</h1>
    <div>
      <Row :gutter='20' >
        <Col span="6">
          <Card>
            <h2>主账户总额</h2>
            <h1>{{allmoney}}</h1>
            <p>指账户所以金额包括结算金额和未结算金额</p>
          </Card>
        </Col>
        <Col span='6'><Card>
            <h2>交易账户总额</h2>
            <h1>{{jymoney}}</h1>
            <p>指全部支入支出金额</p>
          </Card></Col>
        <Col span='6'><Card>
          <h2>余额账户总额</h2>
            <h1>{{yemoney}}</h1>
            <p>指可提现，可转账金额</p>
          
          </Card></Col>
        <Col span='6'><Card>
          <h2>分润账户总额</h2>
            <h1>0.00</h1>
            <p>指分润收益总额</p>
          
          </Card></Col>
      </Row>
      <Row>
        <div class="navlist" >
          <span v-for="(item,index) in clicklist" :key="index" :class="{active:index==idx}" @click="changeindex(index)">{{item}}  </span>
        </div>
        <Card class="mycard2">   
            <Row>
                <Col span='4'>
                    <div>
                      <p>交易金额 <span>￥{{totalmoney}}</span></p>
                      <p>今日成交额：{{tadaymoney}}</p>
                    </div>
                    <div>
                      <p>已结算金额 <span>￥{{havemoney}}</span></p>
                      <p>今日结算：{{todayhavemoney}}</p>
                    </div>
                    <div>
                      <p>未结算金额 <span>￥{{nomoney}}</span> </p>
                      <p>今日未结算金额：{{todaynomoney}}</p>
                    </div>
                </Col>
                <Col span='20'>
                  <div id="myChart" :style="{width: '100%', height: '350px'}"></div>
                </Col>
            </Row>
        </Card>
      </Row>
    </div>




  </div>
</template>

<script>
import "@/assets/styles/tranding.less";
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "accountList",
  data() {
    return {
      allmoney:"0.00",
      jymoney:"0.00",
      yemoney:"0.00",
      clicklist:["交易账户",'余额账户',"分润账户"],
      idx:0,
      webname:'',
      totalmoney:254.245,
      tadaymoney:243.894,
      havemoney:243.968,
      todayhavemoney:204.368,
      nomoney:601.327,
      todaynomoney:529.534,
      havedata:[100, 32, 150, 194, 120, 230, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135],
      nodata:[120, 132, 101, 134, 190, 130, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135],
      total:[320, 264, 251, 334, 210, 230, 310,279,290,203,210,250,290,270,240,230,280,260,220,240,220,260,293,245,262,235]
    }
  },
  methods: {
    changeindex(index){
      this.idx=index;
      if(index==0){
      this.totalmoney=264.245;
      this.tadaymoney=243.894;
      this.havemoney=53.968;
      this.todayhavemoney=204.368;
      this.nomoney=601.327;
      this.todaynomoney=529.534;
      this.havedata=[100, 32, 150, 194, 120, 230, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135]
      this.nodata=[120, 132, 101, 134, 190, 130, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135]
      this.total=[320, 264, 251, 234, 210, 230, 310,279,290,203,210,250,290,270,240,230,280,260,220,240,220,260,293,245,262,235]
      }
      else if(index==1){
      this.totalmoney=200.000;
      this.tadaymoney=124.561;
      this.havemoney=156.454;
      this.todayhavemoney=1015.731;
      this.nomoney=942.235;
      this.todaynomoney=218.369;
      this.nodata=[200, 232, 250, 194, 220, 230, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135]
      this.total=[120, 232, 201, 134, 190, 130, 210,179,190,203,210,250,190,170,140,130,180,160,120,140,120,160,193,145,162,135]
      this.havedata=[220, 264, 351, 334, 310, 230, 310,279,290,203,210,250,290,270,240,230,280,260,220,240,220,260,293,245,262,235]
      }
      else{
        this.totalmoney=435.245;
      this.tadaymoney=253.894;
      this.havemoney=20.968;
      this.todayhavemoney=204.36;
      this.nomoney=629.32;
      this.todaynomoney=529.534;
      this.havedata=[200, 132, 250, 294, 220, 130, 110,279,160,143,110,150,190,170,170,230,180,190,180,170,190,170,193,165,192,155]
      this.nodata=[140, 152, 121, 164, 90, 130, 110,109,160,103,110,150,120,110,110,170,120,110,160,120,170,110,123,175,192,175]
      this.total=[420, 464, 451, 434, 310, 330, 390,379,390,303,310,350,390,370,340,330,380,360,320,340,320,360,393,445,362,335]
      }
      this.drawLine()
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip : {
          trigger: 'axis',
    },
    legend: {
        data:['交易额','已结算','未结算'],
        textStyle:{//图例文字的样式
            color:'#ccc',
            fontSize:16
        },
        x:'90%'


    },
    calculable : false,
    xAxis : [
        {
            type : 'category',
            boundaryGap : true,
            data : ['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','1','2','3','4',],
            color:'#8080b8'
        }
    ],
    yAxis : [
        {
            type : 'value',
            show:false
        }
    ],
    series : [
      {
            name:'已结算',
            type:'line',
            symbolSize: 0.01, 
            stack: '总量',
            areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#f3508d" },
                    { offset: 0.2, color: "#da4b84" },
                    { offset: 1, color: "#2a2a45" }
                  ])
                },
             color:'#da4b84' ,
        
            data:this.havedata
        },
        {
            name:'未结算',
            type:'line',
            symbolSize: 0.01, 
            stack: '总量',
             areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#1df857" },
                    { offset: 0.32, color: "#1fdc55" },
                    { offset: 1, color: "#2a2a45" }
                  ])
                },
             color:'#1fdc55' ,   
            data:this.nodata
        },
        
        {
            name:'交易额',
            type:'line',
            symbolSize: 0.01, 
             areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#15f5ff" },
                    { offset: 0.61, color: "#4ff9cc" },
                    { offset: 1, color: "#236c7b" }
                  ])
                },
             color:'#236c7b' , 
            stack: '总量',
           
            data:this.total
        },
 
    ]
      });
      return myChart;
    },
  },
  mounted() {
    this.webname=this.$route.query.name;
    if(this.$route.query.money){
      let data=this.$route.query.money
      for(var i=0;i<data.length;i++){
        console.log(data[i])
        if(data[i].accountTypeName&&data[i].accountTypeName=="主账户"){
          this.allmoney=data[i].balance
        }
        if(data[i].accountTypeName&&data[i].accountTypeName=="余额账户"){
          this.yemoney=data[i].balance
        }
        if(data[i].accountTypeCode&&data[i].accountTypeCode=="交易账户"){
          this.jymoney=data[i].balance
        }

      }

    }
    var drawLine = this.drawLine();
    window.onresize = function temp() {
      drawLine.resize();
       //重绘，窗口大小改动时
    };

  }
};
</script>
<style lang="less" scoped>
h1 {
  color: #4ff9cc;
  margin-bottom: 30px;
}
.ivu-card {
  background: #2a2a45;
  border: 0;

  h2 {
    color: #3e9b8e;
    margin-bottom: 10px;
  }
  p {
    color: #3e9b8e;
    margin-top: 30px;
    height: 30px;
  }
}

.mycard2{
  .ivu-col{color:#d0d3e3;cursor: pointer;
 .ivu-card-body{padding-top:0px;}
  div{margin-top:30px;}
  p{color:#4ff9cc;margin-top:10px;height: 45px;font-size:15px;
    span{font-size:20px;}
  }
  
}
}
  .navlist{font-size:16px;
    
    margin-top:30px;
    margin-bottom:-2px;
    span{line-height: 30px;display: inline-block;padding:20px 30px;cursor: pointer;}
    .active{background: #2a2a45;font-size:20px; color:#4ff9cc;}
  }
</style>