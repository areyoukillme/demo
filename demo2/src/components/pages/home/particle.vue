<template>
    <canvas id="canvas" height="200"  class="canvas"></canvas>
</template>

<script>

export default {
  
  data() {
    return {
      screenWidth:document.body.clientWidth
    }
  },
  mounted() {
    var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');
    let self = this
    window.onresize = () => {
        canvas.width = document.body.clientWidth;
    }
    canvas.width = this.screenWidth; 
    function Ball() {
        this.x = randomNum(3, canvas.width - 3);
        this.y = randomNum(3, 400 - 3);
        this.r = randomNum(1, 3);
        this.color = randomColor();
        this.speedX = randomNum(-3, 3) * 0.2;
        this.speedY = randomNum(-3, 3) * 0.2;
    }
    Ball.prototype = {
            draw: function () {
                ctx.beginPath();
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fill();
            },
            move: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x <= 3 || this.x > canvas.width - 3) {
                    this.speedX *= -1;
                }
                if (this.y <= 3 || this.y >= canvas.height - 3) {
                    this.speedY *= -1;
                }
            }
    }
    var balls = [];
    //创建200个小球
    for (var i = 0; i < 200; i++) {
        var ball = new Ball();
        balls.push(ball);
    }
    main()
    function main() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);     
        mouseLine();
        drawLine();
        window.requestAnimationFrame(main);
    }
    var mouseX;
    var mouseY;
    canvas.onmousemove = function (e) {
        var ev = event || e;
        mouseX = ev.offsetX;
        mouseY = ev.offsetY;
    }
    function drawLine() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw();
            balls[i].move();
            for (var j = 0; j < balls.length; j++) {
                if (i != j) {
                    if (Math.sqrt(Math.pow((balls[i].x - balls[j].x), 2) + Math.pow((balls[i].y - balls[j].y), 2)) < 80) {
                        ctx.beginPath();
                        ctx.moveTo(balls[i].x, balls[i].y);
                        ctx.lineTo(balls[j].x, balls[j].y);
                        ctx.strokeStyle = "white";
                        ctx.globalAlpha = 0.2;
                        ctx.stroke();
                    }
                }
            }
        }
    }
    function mouseLine() {
        for (var i = 0; i < balls.length; i++) {
            if (Math.sqrt(Math.pow((balls[i].x - mouseX), 2) + Math.pow((balls[i].y - mouseY), 2)) < 80) {
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = "white";
                ctx.globalAlpha = 0.8;
                ctx.stroke();
            }
        }
    }
    function randomNum(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m);
    }
    function randomColor() {
        return "rgb(" + randomNum(0, 255) + "," + randomNum(0, 255) + "," + randomNum(0, 255)  +")";
    }
    window.onresize()
  },
}
</script>

<style>
.canvas {
    position: fixed;
}
</style>