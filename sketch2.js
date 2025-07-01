const s = (p) => {
    let pg3D;
    let angleX = 0;
    let angleY = 0;

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
        pg3D = p.createGraphics(p.windowWidth, 600, p.WEBGL);
        pg3D.clear();

        // 前面の2Dキャンバス
        const cnv = p.createCanvas(p.windowWidth, 600);
        cnv.parent('canvas-container2');

        // 球の画面上中心位置
        const sphereCenterX = p.width / 2 + p.width / 7;
        const sphereCenterY = p.height / 2;
        const exclusionRadius = 300; // この範囲にはCrossを置かない

        let tries;
        for (let i = 0; i < 7; i++) {
            let x, y;
            tries = 0;
            do {
                x = p.random(50, p.width - 50);
                y = p.random(50, p.height - 50);
                tries++;
                if (tries > 100) {
                    // あまりにも配置できない場合は強制終了
                    break;
                }
            } while (p.dist(x, y, sphereCenterX, sphereCenterY) < exclusionRadius);

            crosses.push(new Cross(
                x,
                y,
                p.random(15, 30)
            ));
        }
    };

    p.draw = () => {
        pg3D.background(250);


        // 毎フレーム角度を少しずつ増やす
        angleX += 0.01;
        angleY += 0.01;

        pg3D.push();
        pg3D.translate(p.width / 7, 0, 0);
        pg3D.rotateY(angleY);
        pg3D.rotateX(angleX);

        pg3D.noFill();
        pg3D.stroke("#C5E8F2");
        pg3D.strokeWeight(2);

        pg3D.sphere(150, 20, 20);
        pg3D.pop();

        // 3Dを描画
        p.image(pg3D, 0, 0, p.width, p.height);




        for (let c of crosses) {
            c.update();
            c.display();
        }
    };
};

new p5(s);
