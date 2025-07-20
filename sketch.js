const s3 = (p) => {
    let pg3D;

    // Cross クラス
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
            this.x = this.xRatio * p.width;
            this.y = this.yRatio * p.height;

            let d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
            if (d < this.size * 1.5) {
                if (p.abs(this.angularVelocity) < 0.1) {
                    if (p.windowWidth >= 768) {

                        this.angularVelocity = p.random(-0.2, 0.2);
                    }
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


        // 背景の3Dキャンバス
        pg3D = p.createGraphics(document.documentElement.clientWidth, 930, p.WEBGL);
        pg3D.clear();

        const cnv = p.createCanvas(document.documentElement.clientWidth, 930);
        cnv.parent('canvas-container');

        const cubeCenterX = p.width / 2 + p.width / 7;
        const cubeCenterY = p.height / 2;
        const cubeRadius = 200;

        let tries;
        for (let i = 0; i < 10; i++) {
            let x, y;
            tries = 0;
            do {
                x = p.random(50, p.width - 50);
                y = p.random(50, p.height - 50);
                tries++;
                if (tries > 100) break;
            } while (
                p.dist(x, y, cubeCenterX, cubeCenterY) < cubeRadius
            );

            crosses.push(new Cross(
                x / p.width,
                y / p.height,
                p.random(15, 30)
            ));
        }
    };

    p.draw = () => {
        // キャンバスの高さは固定だが、幅は動的
        if (p.width !== document.documentElement.clientWidth) {
            //p.resizeCanvas(p.windowWidth, 900);
            pg3D = p.createGraphics(document.documentElement.clientWidth, 900, p.WEBGL);
        }


        // スマホ幅なら無効
        if (p.windowWidth <= 768) {
            p.background("#fef6f9");

            for (let c of crosses) {
                c.update();
                c.display();
            }
            return;
        }


        pg3D.clear();
        pg3D.background("#fef6f9");

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

        p.image(pg3D, 0, 0, p.width, p.height);


        for (let c of crosses) {
            c.update();
            c.display();
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(document.documentElement.clientWidth, 900);
        pg3D = p.createGraphics(document.documentElement.clientWidth, 900, p.WEBGL);
    };
};

new p5(s3);
