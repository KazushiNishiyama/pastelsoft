const s2 = (p) => {
    class Cross {
        constructor(xRatio, yRatio, size) {
            this.xRatio = xRatio; // 横比率
            this.yRatio = yRatio; // 縦比率
            this.size = size;
            this.angle = 0;
            this.angularVelocity = 0;

            const colorSets = [
                ['#AEEEEE', '#FFB6C1'],
                ['#AEEEEE', '#FFDAB9'],
                ['#FFB6C1', '#FFDAB9']
            ];
            const choice = p.floor(p.random(colorSets.length));
            this.color1 = colorSets[choice][0];
            this.color2 = colorSets[choice][1];
        }

        update() {
            // 毎フレーム再計算
            this.x = this.xRatio * p.width;
            this.y = this.yRatio * p.height;

            let d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
            if (d < this.size * 1.5) {
                if (p.abs(this.angularVelocity) < 0.1) {
                    this.angularVelocity = p.random(-0.2, 0.2);
                }
            }

            this.angle += this.angularVelocity;
            this.angularVelocity *= 0.98;
        }

        display() {
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.angle);

            p.strokeWeight(4);

            p.stroke(this.color1);
            p.line(-this.size, -this.size, this.size, this.size);

            p.stroke(this.color2);
            p.line(this.size, -this.size, -this.size, this.size);

            p.pop();
        }
    }

    let crosses = [];

    p.setup = () => {
        const cnv = p.createCanvas(document.documentElement.clientWidth, document.body.scrollHeight - 900);
        cnv.parent('canvas-container3');

        for (let i = 0; i < 60; i++) {
            const x = p.random(50, p.width - 50);
            const y = p.random(50, p.height - 50);

            crosses.push(new Cross(
                x / p.width,  // 比率で保存
                y / p.height,
                p.random(15, 30)
            ));
        }

        // スクロールイベントで加速度
        window.addEventListener("scroll", () => {
            if (p.windowWidth >= 769) {
                for (let c of crosses) {
                    c.angularVelocity += p.random(-0.05, 0.05);
                }
            }

        });

        // ウィンドウリサイズ
        window.addEventListener("resize", () => {
            p.resizeCanvas(document.documentElement.clientWidth, document.body.scrollHeight - 800);
        });
    };

    p.draw = () => {


        p.background("#f7fbfc");

        for (let c of crosses) {
            c.update();
            c.display();
        }


    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, 4500);
    };
};

new p5(s2);
