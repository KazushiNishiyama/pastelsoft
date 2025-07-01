const s2 = (p) => {
    // Cross クラス
    class Cross {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.angle = 0;
            this.angularVelocity = 0;

            // カラーパターンをランダムに選ぶ
            const colorSets = [
                ['#AEEEEE', '#FFB6C1'], // 水色 × ピンク
                ['#AEEEEE', '#FFDAB9'], // 水色 × オレンジ
                ['#FFB6C1', '#FFDAB9']  // ピンク × オレンジ
            ];
            const choice = p.floor(p.random(colorSets.length));
            this.color1 = colorSets[choice][0];
            this.color2 = colorSets[choice][1];
        }

        update() {
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

            // 1本目の線
            p.stroke(this.color1);
            p.line(-this.size, -this.size, this.size, this.size);

            // 2本目の線
            p.stroke(this.color2);
            p.line(this.size, -this.size, -this.size, this.size);

            p.pop();
        }
    }

    let crosses = [];

    p.setup = () => {
        const cnv = p.createCanvas(p.windowWidth, 4500);
        cnv.parent('canvas-container3');
        for (let i = 0; i < 60; i++) {
            crosses.push(new Cross(
                p.random(50, p.width - 50),
                p.random(50, p.height - 50),
                p.random(15, 30)
            ));
        }
    };

    p.draw = () => {
        p.background("#f7fbfc");

        for (let c of crosses) {
            c.update();
            c.display();
        }

        // 2Dキャンバス：残像の円
        p.noStroke();
        p.fill(0, 30);

        p.fill("#C5E8F2");
        p.ellipse(p.mouseX, p.mouseY, 40, 40);
    };
};

new p5(s2);
