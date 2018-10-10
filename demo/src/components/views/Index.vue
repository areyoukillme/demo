<template>
  <div class="index">
    
  
  <Row :gutter="20" class="row1">
    <Col span="8">
      <card><div id="myChart" :style="{width: '100%', height: '250px'}"></div>
            <div class="bottomletter">日环比：9%</div>
        </card>
    </Col>
    <Col span="8">
      <card><div id="myChart2" :style="{width: '100%', height: '250px'}"></div><div class="bottomletter">今日交易额：2581560.02</div></card>
    </Col>
    <Col span="8">
      <card><div id="myChart3" :style="{width: '100%', height: '250px'}"></div><div class="bottomletter">今日交易笔数：1735</div></card>
    </Col>

  </Row>
  <Row :gutter="20">
    <Col span="16">
      <card><div id="myChart4" :style="{width: '100%', height: '350px'}"></div></card>
    </Col>
    <Col span="8">
      <card>
        <div class="waitdo" :style="{width: '100%', height: '350px'}">
          <h2>待办事项</h2>
          <p> <span></span> 您还有4个用户待审核</p>
          <p> <span></span> 有4个用户审核失败</p>
          <p><span></span>有10笔异常订单待跟进</p>
        </div></card>
    </Col>

  </Row>

  </div>

</template>
<script>
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "index",
  data() {
    return {
      params: {
        page: 1,
        limit: 10
      }
    };
  },
  mounted() {
    this.$store.commit('CLOSE_SLIDEBAR');
    var drawLine = this.drawLine();
    var drawLine2 = this.drawLine2();
    var drawLine3 = this.drawLine3();
    var drawLine4 = this.drawLine4();
    window.onresize = function temp() {
      drawLine.resize();
      drawLine2.resize();
      drawLine3.resize();
      drawLine4.resize();
       //重绘，窗口大小改动时
    };
   
  
  },
  destroyed(){
    this.$store.commit('OPEN_SLIDEBAR');
  },

  methods: {

    // 基于准备好的dom，初始化echarts实例
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item"
        },
        lineStyle: {
          normal: {}
        },
        title:{
          text:"164",
          x:'24px',
          y:'24px',
          textStyle:{
            color:'#4ff9cc',
            fontSize:'24'
          },
          
        },
        legend:{
          itemHeight  :0,
          x:'0',
          textStyle:{
            color:'#3e9b8e',
            fontSize:'16'
          },
          data:[  {name:"新增用户数（户）",icon:'no'},
                ],
        },

        grid: {
          left: "0%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },

        xAxis: {
          //'name':'时间',
          type: "category",
          show: false,
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日",]
        },
        yAxis: {
          name: "(个)",
          type: "value",
          show: false
        },
        series: [
          {
            name: "新增用户数（户）",
            showLegendSymbol:false,
            type: "line",
            symbolSize: 1,
            stack: "总量1",
            smooth: true,
            // areaStyle: {normal: {}},
            data: [33,44,32,37,45,35,43
          ],
            //itemStyle : {normal : {color:'#ffc400'}},
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "top",
                  formatter: "{c}"
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#15f5ff" },
                    { offset: 0.6, color: "#099cff" },
                    { offset: 1, color: "#005eff" }
                  ])
                },
                color: "#2a2a45"
              }
            }
          }
        ]
      });
      return myChart;
    },
    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart2 = echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      myChart2.setOption({
        tooltip: {
          trigger: "item"
        },
        lineStyle: {
          normal: {}
        },
        title:{
          text:"258,1560.02",
          x:'24px',
          y:'24px',
          textStyle:{
            color:'#4ff9cc',
            fontSize:'24'
          },
          
        },
        legend:{
          itemHeight  :0,
          x:'0',
          textStyle:{
            color:'#3e9b8e',
            fontSize:'16'
          },
          data:[  {name:"平台交易总额（万）",icon:'no'},],
        },

        grid: {
          left: "0%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },

        xAxis: {
          //'name':'时间',
          type: "category",
          show: false,
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          name: "(个)",
          type: "value",
          show: false
        },
        series: [
          {
            name: "平台交易总额（万）",
            type: "line",
            stack: "总量1",
            symbolSize: 1,
            smooth: true,
            // areaStyle: {normal: {}},
            data: [67.4,71.9,68.7,75.4,84.6,77.6,60.0,
],
            //itemStyle : {normal : {color:'#ffc400'}},
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "top",
                  formatter: "{c}"
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#15f5ff" },
                    { offset: 0.6, color: "#099cff" },
                    { offset: 1, color: "#005eff" }
                  ])
                },
                color: "#2a2a45"
              }
            }
          }
        ]
      });
      return myChart2;
    },
    drawLine3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart3 = echarts.init(document.getElementById("myChart3"));
      // 绘制图表
      myChart3.setOption({
        tooltip: {
         trigger: 'item'
          
        },
     
        title:{
          text:"1238,6512.02",
          x:'24px',
          
          y:'24px',
          textStyle:{
            color:'#4ff9cc',
            fontSize:'24'
          },
          
        },
        legend:{
          itemHeight  :0,//改变圆圈大小
          x:'0',
          textStyle:{
            color:'#3e9b8e',
            fontSize:'16'
          },
          data:[  {name:"平台交易总笔数（万）",icon:'no'},],
        },

        grid: {
          left: "0%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },

        xAxis: {
          //'name':'时间',
          type: "category",
          show: false,
          boundaryGap: true,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          name: "(个)",
          type: "value",
          show: false
        },
        series: [
          {
            name: "平台交易总笔数（万）",
            showLegendSymbol:false,
            type: "bar",
            stack: "总量1",
            smooth: true,
            // areaStyle: {normal: {}},
            data: ["20", "24", "23", "21", "32", "35", "30"],
            //itemStyle : {normal : {color:'#ffc400'}},
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "top",
                  formatter: "{c}"
                },
              color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                    [
                        {offset: .03, color: '#15c7ff'},   
                        {offset: 1, color: '#9f55ff'}
                    ]
                 )
              }
            }
          }
        ]
      });
      return myChart3;
    },
    drawLine4() {
      // 基于准备好的dom，初始化echarts实例
      let myChart4 = echarts.init(document.getElementById("myChart4"));
      // 绘制图表
      myChart4.setOption({
        textStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      },
       tooltip: {
          trigger: 'axis',
         axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                lineStyle:{
                  color:"rgba(0,0,0,0)"
                }
            }
        }, 
        legend:{  
          x:'0',
          itemHeight:"0",//改变圆圈大小
          textStyle:{
            color:'#4ff9cc',
            fontSize:'24'
          },
          data:[  {name:"用户增长趋势图",icon:'rect'}],
        },

        grid: {
          left: "0%",
          right: "4%",
          bottom: "0%",
          containLabel: true
        },

        xAxis: {
          //'name':'时间',
          type: "category",
          show:false,
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle:{
                 color: ['#3e3e6d'],
                 width: 1,
                type: 'solid'
            }
          }

        },
        series: [
          {
            name: "用户增长趋势图",
            type: "line",
            symbolSize: 3,
          

            // areaStyle: {normal: {}},
            data: ["5", "14", "13", "11", "12", "15", "20"],
            //itemStyle : {normal : {color:'#ffc400'}},
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "top",
              
                },
          color:  '#15c7ff',   
                   
              areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: .03, color: '#15c7ff'},   
                        {offset: 1, color: '#9f55ff'}
                  ])
                },
            lineStyle: {
             width:4
        },  
              }
            }
          }
        ]
      });
      return myChart4;
    },

    
  },
  created() {}
};
</script>
<style lang="less" scoped>
.cardMessage {
  .ivu-icon {
    font-size: 38px;
  }
  .subText {
    color: #9ea7b4;
  }
}
.row1 {
  margin-bottom: 20px;
}
.ivu-card {
  background: #2a2a45;
  border: none;
}
.waitdo{
  cursor: pointer;
  h2{font-size:24px;color:#4ff9cc;}
  p{
    padding-left:20px;
    font-size:16px;
    color:#4ff9cc;
    margin-top:32px;
   
    span{
      display: inline-block;
      background: #e25b28;
      width:6px;
      height: 6px;
      margin-right: 16px;
      vertical-align: middle;
      border-radius: 50%;
    }
  };

}
.bottomletter{color:#d0d3e3;padding-left:25px;}
</style>
