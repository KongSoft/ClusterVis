function drawScatter(divID, dataset,other_dataset) {
    console.log(other_dataset);
    sub_dataset=other_dataset['data'];
    //console.log(sub_dataset);
    var color=['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(56,108,176)', 'rgb(240,2,127)', 'rgb(191,91,23)'];

    var svgWidth = 400;
    var svgHight = 340;
    var padding = 35;
    // 创建SVG
    d3.select(divID).select('svg').remove();
    var svg = d3.select(divID)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHight);

    // 设置标题
    svg.append('text')
        .attr('x', svgWidth / 2 - 120)
        .attr('y', 30)
        .attr('class', 'title')
        .text('投影视图');

    // 创建比例尺
    var xScale = d3.scale.linear()
        .domain([d3.min(dataset, function (d) {
            return d[0];
        }), d3.max(dataset, function (d) {
            return d[0];
        })]).range([padding, svgWidth - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([d3.min(dataset, function (d) {
            return d[1];
        }), d3.max(dataset, function (d) {
            return d[1];
        })]).range([svgHight - padding, padding]);

    var rScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d[1];
        })]).range([2, 4]);

    // 设置散点的坐标, 半径
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d[0]);
        })
        .attr('cy', function (d) {
            return yScale(d[1]);
        })
        .attr('fill', function (d) {
            //console.log(d[2]);
            var sque=d[2]%6;
            return color[sque];
            
        })
        .attr('r', function (d) {
            return 3;
        });


    if (sub_dataset.length>0){
        svg.selectAll('circle1')
            .data(sub_dataset)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d[0]);
            })
            .attr('cy', function (d) {
                return yScale(d[1]);
            })
            .attr('fill', function (d) {
                // if (d[3] == 1)
                //     return "green";
                // else
                //     return "red"
                return "none";
            })
            .attr('r', function (d) {
                return 3;
            })
            .attr("stroke", function (d) {
                return color[6];
            })
            .attr("stroke-width", 1);
    }

    // 设置精度和样式
    var formatPrecision = d3.format('$');

    // 定义X轴
    var xAxis = d3.svg.axis()
        .scale(xScale)

        // 粗略的设置刻度线的数量，包括原点
        .ticks(7)
        .orient('bottom')

        // 设置刻度格式
        .tickFormat(formatPrecision);

    // 定义Y轴
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(7)
        .tickFormat(formatPrecision);

    // 创建X轴, svg中： g元素是一个分组元素
    svg.append('g')
        .attr('class', 'axis')

        // 设置据下边界的距离
        .attr('transform', 'translate(0, ' + (svgHight - padding) + ')')
        .call(xAxis);

    // 创建Y轴
    svg.append('g')
        .attr('class', 'axis')

        // Y轴离左边界的距离
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);

}