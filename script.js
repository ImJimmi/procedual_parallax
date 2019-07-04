$(function() {
    var width = 0;
    var height = 0;

    var baselines = [0.3, 0.4, 0.5, 0.6];

    class MountainRange {
        constructor(index) {
            this.numPoints = 500;
            this.index = index;

            this.pixelsPerPoint = 5;
            this.points = [];

            var freq0 = 0.01;
            var freq1 = 0.03;
            var freq2 = 0.1;
            var freq3 = 0.5;

            noise.seed(Math.random());
    
            for (var i = 0; i < this.numPoints; i++) {
                var y = noise.simplex2(freq0 * i, 0) * 0.075;
                y += noise.simplex2(freq1 * i, 0) * 0.02;
                y += noise.simplex2(freq2 * i, 0) * 0.005;
                y += noise.simplex2(freq3 * i, 0) * 0.002;
    
                this.points.push(y);
            }
        }

        paint(cnvs) {
            var ctx = cnvs.getContext("2d");
            ctx.beginPath();
    
            var startPoint = Math.floor((this.numPoints / 2) - (width / (this.pixelsPerPoint * 2)));
            var xOffset = (this.numPoints / 2) - (width / (this.pixelsPerPoint * 2)) - startPoint;

            var y0 = (baselines[this.index] + this.points[startPoint]) * height;
            var y1 = (baselines[this.index] + this.points[startPoint + 1]) * height;
    
            ctx.moveTo(0, y1 * xOffset + y0 * (1 - xOffset));
            
            for (var i = 1; i < this.numPoints; i++) {
                var x = i * this.pixelsPerPoint - xOffset * this.pixelsPerPoint;
                var y = height * (baselines[this.index] + this.points[i + startPoint]);
                ctx.lineTo(x, y);
            }
    
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
    
            var grad;

            if (this.index !== baselines.length - 1) {
                var diff = baselines[this.index + 1] - baselines[this.index];
                grad = ctx.createLinearGradient(0, baselines[this.index] * height,
                                                0, (baselines[this.index + 1] + diff) * height);
            } else {
                grad = ctx.createLinearGradient(0, baselines[this.index] * height,
                                                0, height);
            }
            
            if (this.index === 0) {
                grad.addColorStop(0, "#ACC0C6");
                grad.addColorStop(1, "#DCDAD5");
            } else if (this.index === 1) {
                grad.addColorStop(0, "#66919D");
                grad.addColorStop(1, "#ACC0C6");
            }
    
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    var mountains = [new MountainRange(0), new MountainRange(1)];

    class Forest {
        constructor(index) {
            this.numPoints = 75 + Math.random() * 50;
            this.index = index;

            this.pixelsPerPoint = 25;
            this.points = [];

            noise.seed(Math.random());

            for (var i = 0; i < this.numPoints; i++) {
                var y = 0.025 + Math.random() * 0.025;

                if (i % 2 == 0) {
                    y *= -1;
                }
                
                var r = noise.simplex2(0.05 * i, 0) * 0.075;
                r += noise.simplex2(0.15 * i, 0) * 0.02;

                y += r;

                this.points.push(y);
            }
        }

        paint(cnvs) {
            var ctx = cnvs.getContext("2d");
            ctx.beginPath();
    
            var startPoint = Math.floor((this.numPoints / 2) - (width / (this.pixelsPerPoint * 2)));
            var xOffset = (this.numPoints / 2) - (width / (this.pixelsPerPoint * 2)) - startPoint;

            var y0 = (baselines[this.index] + this.points[startPoint]) * height;
            var y1 = (baselines[this.index] + this.points[startPoint + 1]) * height;
    
            ctx.moveTo(0, y1 * xOffset + y0 * (1 - xOffset));
            
            for (var i = 1; i < this.numPoints; i++) {
                var x = i * this.pixelsPerPoint - xOffset * this.pixelsPerPoint;
                var y = height * (baselines[this.index] + this.points[i + startPoint]);
                ctx.lineTo(x, y);
            }
    
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
    
            if (this.index == 2) {
                ctx.fillStyle = "#1D3339";
            } else {
                ctx.fillStyle = "#1C2A2B";
            }

            ctx.fill();
        }
    }

    var forests = [new Forest(2), new Forest(3)];

    //==========================================================================    
    resized();

    $(window).resize(function() {
        resized();
    });

    onScroll();

    $(window).scroll(function () {
        onScroll();
    });

    //==========================================================================
    function repaint() {
        var cnvs = $("#cnvs")[0];

        paintBackground(cnvs);

        for (var i = 0; i < mountains.length; i++) {
            if (mountains[i].pixelsPerPoint * mountains[i].numPoints < width) {
                mountains[i].pixelsPerPoint = width / (mountains[i].numPoints - 1);
            }

            mountains[i].paint(cnvs);
        }

        for (var i = 0; i < forests.length; i++) {
            forests[i].paint(cnvs);
        }
    }

    function resized() {
        width = $(window).innerWidth();
        height = $(window).innerHeight();

        var cnvs = $("#cnvs")[0];
        cnvs.width = width;
        cnvs.height = height;

        repaint();
    }

    function onScroll() {
        var proportion = $(window).scrollTop() / $(window).innerHeight();

        var norms = [0.3, 0.4, 0.5, 0.6];

        for (var i = 0; i < norms.length; i++) {
            baselines[i] = norms[i] + (1 - norms[i]) * proportion * 0.8;
        }

        repaint();
    }

    function paintBackground(cnvs) {
        var ctx = cnvs.getContext("2d");

        ctx.fillStyle = "#DCDAD5";
        ctx.fillRect(0, 0, width, height);
    }
});
