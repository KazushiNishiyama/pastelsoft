const s3 = (p) => {
    let pg3D;

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
        // 背景の3Dキャンバス
        pg3D = p.createGraphics(p.windowWidth, 900, p.WEBGL);
        pg3D.clear();

        // 前面の2Dキャンバス
        const cnv = p.createCanvas(p.windowWidth, 900);
        cnv.parent('canvas-container');

        // キューブ投影中心
        const cubeCenterX = p.width / 2 + p.width / 7;
        const cubeCenterY = p.height / 2;
        const cubeRadius = 200; // 避ける範囲の半径

        let tries;
        for (let i = 0; i < 10; i++) {
            let x, y;
            tries = 0;
            do {
                x = p.random(50, p.width - 50);
                y = p.random(50, p.height - 50);
                tries++;
                if (tries > 100) {
                    break;
                }
            } while (
                p.dist(x, y, cubeCenterX, cubeCenterY) < cubeRadius
            );

            crosses.push(new Cross(
                x,
                y,
                p.random(15, 30)
            ));
        }
    };

    p.draw = () => {
        // 3Dキャンバスをクリア
        pg3D.clear();

        pg3D.background("#fef6f9"); // ダブルシャープはNGなので修正

        pg3D.push();
        pg3D.translate(p.width / 7, 0, 0);
        pg3D.noFill();
        pg3D.strokeWeight(1);

        for (let y = -500; y <= 500; y += 500) {
            for (let x = -500; x <= 500; x += 500) {
                pg3D.noFill();
                pg3D.stroke("#FFB6C1");
                pg3D.rotateX(p.frameCount / 1.5 * 0.01);
                pg3D.rotateY(p.frameCount / 1.5 * 0.01);
                pg3D.box(200, 200, 200);
            }
        }
        pg3D.pop();

        // 3Dを描画
        p.image(pg3D, 0, 0, p.width, p.height);

        // 2Dキャンバス：残像の円
        p.noStroke();
        p.fill(0, 30);

        p.fill("#C5E8F2");
        p.ellipse(p.mouseX, p.mouseY, 40, 40);

        for (let c of crosses) {
            c.update();
            c.display();
        }
    };
};

new p5(s3);
