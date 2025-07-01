let myp5 = new p5((p) => {
    let balls = [];
    let lastScrollY;

    p.setup = function () {
        let cnv = p.createCanvas(p.windowWidth, p.windowHeight - 14);
        cnv.parent('canvas-container4');

        lastScrollY = window.scrollY;

        const colorSets = [
            ['#AEEEEE', '#FFB6C1'],
            ['#AEEEEE', '#FFDAB9'],
            ['#FFB6C1', '#FFDAB9']
        ];

        // 初期3つ
        for (let i = 0; i < 30; i++) {
            balls.push(makeRandomBall());
        }

        // ボタンのイベント設定
        const addBtn = document.getElementById('addBallBtn');
        const clearBtn = document.getElementById('clearBallsBtn');

        addBtn.addEventListener('click', () => {
            balls.push(makeRandomBall());
        });

        clearBtn.addEventListener('click', () => {
            balls = [];
        });

        function makeRandomBall() {
            let x = p.random(50, p.width - 50);
            let colorChoice = p.floor(p.random(colorSets.length));
            let fillColor = colorSets[colorChoice][p.floor(p.random(2))];
            return new Ball(x, p.random(-150, 150), fillColor);
        }
    };

    p.draw = function () {
        p.clear();

        let currentScrollY = window.scrollY;
        let deltaScroll = currentScrollY - lastScrollY;

        if (!isNaN(deltaScroll) && deltaScroll !== 0) {
            for (let ball of balls) {
                ball.applyForce(p.createVector(0, -deltaScroll * 0.03));
            }
        }

        lastScrollY = currentScrollY;

        for (let ball of balls) {
            ball.update();
            ball.checkMouse();
            ball.display();
        }

        // 2Dキャンバス：残像の円
        p.noStroke();
        p.fill(0, 30);

        p.fill("#C5E8F2");
        p.ellipse(p.mouseX, p.mouseY, 40, 40);
    };

    class Ball {
        constructor(x, y, color) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.radius = 20;
            this.gravity = 0.5;
            this.friction = 0.99;
            this.bounce = -0.3;
            this.fillColor = color;
        }

        applyForce(force) {
            this.acc.add(force);
        }

        update() {
            this.applyForce(p.createVector(0, this.gravity));

            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);

            // 左右の壁
            if (this.pos.x - this.radius < 0) {
                this.pos.x = this.radius;
                this.vel.x *= -1;
            }
            if (this.pos.x + this.radius > p.width) {
                this.pos.x = p.width - this.radius;
                this.vel.x *= -1;
            }

            // 下端の床
            if (this.pos.y + this.radius > p.height) {
                this.pos.y = p.height - this.radius;
                this.vel.y *= this.bounce;
                this.vel.x *= this.friction;
            }

            // 上端
            if (this.pos.y - this.radius < 0) {
                this.pos.y = this.radius;
                this.vel.y *= this.bounce;
                this.vel.x *= this.friction;
            }
        }

        checkMouse() {
            let d = p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y);
            if (d < this.radius) {
                let dir = p.createVector(p.mouseX - this.pos.x, p.mouseY - this.pos.y);
                dir.normalize();
                dir.mult(-5);
                this.applyForce(dir);
            }
        }

        display() {
            p.fill(this.fillColor);
            p.noStroke();
            p.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        }
    }
});
