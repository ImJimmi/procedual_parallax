$(function() {
    noise.seed(Math.random());

    var width = 0;
    var height = 0;

    var baselines = [0.33, 0.4, 0.5, 0.6];
    var mountains = [[], []];
    var numPoints = 500;
    var pixelsPerPoint = 5;

    setupMountainsPoints();

    resized();

    $(window).resize(function() {
        resized();
    });

    //==========================================================================
    function setupMountainsPoints() {
        var freq0 = 0.01;
        var freq1 = 0.03;
        var freq2 = 0.1;
        var freq3 = 0.5;

        for (var i = 0; i < numPoints; i++) {
            var y = baselines[0]
            y += noise.simplex2(freq0 * i, 0) * 0.075;
            y += noise.simplex2(freq1 * i, 0) * 0.02;
            y += noise.simplex2(freq2 * i, 0) * 0.005;
            y += noise.simplex2(freq3 * i, 0) * 0.002;

            mountains[0].push(y);
        }

        for (var i = 0; i < numPoints; i++) {
            var y = baselines[1];
            y += noise.simplex2(0, freq0 * i) * 0.05;
            y += noise.simplex2(0, freq1 * i) * 0.02;
            y += noise.simplex2(0, freq2 * i) * 0.005;
            y += noise.simplex2(0, freq3 * i) * 0.002;

            mountains[1].push(y);
        }
    }

    function resized() {
        width = $(window).width();
        height = $(window).height();

        $(".cnvs").each(function(i) {
            var cnvs = $(this)[0];
            cnvs.width = width;
            cnvs.height = height;
        });

        paintBackground();
        paintMountainsLayer1();
        paintMountainsLayer2();
    }

    function paintBackground() {
        var ctx = $("#cnvs-bg")[0].getContext("2d");

        ctx.fillStyle = "#DCDAD5";
        ctx.fillRect(0, 0, width, height);
    }

    function paintMountainsLayer1() {
        var ctx = $("#cnvs-mountains-1")[0].getContext("2d");
        ctx.beginPath();

        if (pixelsPerPoint * numPoints < width) {
            pixelsPerPoint = width / (numPoints - 1);
        }

        var startPoint = Math.floor((numPoints / 2) - (width / (pixelsPerPoint * 2)));
        var xOffset = (numPoints / 2) - (width / (pixelsPerPoint * 2)) - startPoint;

        var y0 = mountains[0][startPoint] * height;
        var y1 = mountains[0][startPoint + 1] * height;

        ctx.moveTo(0, y1 * xOffset + y0 * (1 - xOffset));
        
        for (var i = 1; i < numPoints; i++) {
            var x = i * pixelsPerPoint - xOffset * pixelsPerPoint;
            var y = height * mountains[0][i + startPoint];
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        var grad = ctx.createLinearGradient(0, baselines[0] * height,
                                            0, (baselines[1] + baselines[1] - baselines[0]) * height);
        grad.addColorStop(0, "#ACC0C6");
        grad.addColorStop(1, "#DCDAD5");

        ctx.fillStyle = grad;
        ctx.fill();
    }

    function paintMountainsLayer2() {
        var ctx = $("#cnvs-mountains-2")[0].getContext("2d");
        ctx.beginPath();

        if (pixelsPerPoint * numPoints < width) {
            pixelsPerPoint = width / (numPoints - 1);
        }

        var startPoint = Math.floor((numPoints / 2) - (width / (pixelsPerPoint * 2)));
        var xOffset = (numPoints / 2) - (width / (pixelsPerPoint * 2)) - startPoint;

        var y0 = mountains[1][startPoint] * height;
        var y1 = mountains[1][startPoint + 1] * height;

        ctx.moveTo(0, y1 * xOffset + y0 * (1 - xOffset));
        
        for (var i = 1; i < numPoints; i++) {
            var x = i * pixelsPerPoint - xOffset * pixelsPerPoint;
            var y = height * mountains[1][i + startPoint];
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        var grad = ctx.createLinearGradient(0, baselines[1] * height,
                                            0, (baselines[2] + baselines[2] - baselines[1]) * height);
        grad.addColorStop(0, "#66919D");
        grad.addColorStop(1, "#ACC0C6");

        ctx.fillStyle = grad;
        ctx.fill();
    }
});
