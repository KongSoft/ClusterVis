
function makeTreeData(feature,right,left,que_value,threshold,retdata){
    //定义每个决策树结点name:id,data:数据点数组，feature:特征，que_value:不同类的点数数组
    //threshold:属性划分点，parent:父结点id，children：子结点
    var Denode = function (name,data,feature, que_value, threshold, parent, children) {
        this.name = name;
        this.data=data;
        this.feature = feature;
        this.que_value = que_value;
        this.threshold = threshold;
        this.parent = parent;
        this.children = children;
    };
    //var dectree = [];
    var dectree_tmp = [];
    var parent_list = [];
    //确定每个结点的父结点
    parent_list[0] = null;
    for (var i = 0; i < right.length; i++) {
        if (right[i] > 0) {
            parent_list[right[i]] = i;
        }
        if (left[i] > 0) {
            parent_list[left[i]] = i;
        }

    }
    //存储结点数组
    for (var i = 0; i < feature.length; i++) {
        dectree_tmp.push(new Denode(i,[],feature[i], que_value[i], threshold[i], parent_list[i], []));
    }
    //console.log(dectree_tmp);
    //dectree[0]=dectree_tmp[0];
    //赋予根结点data数组，其子结点逐层划分
    dectree_tmp[0].data=retdata;
    //对left.right数组做一边遍历，将每个结点的子结点的引用加入到结点的childran数组
    //对每个结点的data数组进行划分，根据划分的属性feature和阈值threshold进行划分
    for (var i = 0; i < feature.length; i++) {
        var sub_data=[];
        if (left[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[left[i]]);
            sub_data = dectree_tmp[i].data.filter(function(d){
                //console.log(d);
                return d[dectree_tmp[i].feature+1]< dectree_tmp[i].threshold;
            });
            dectree_tmp[left[i]].data=sub_data;

            //dectree_tmp[i].da
        }
        if (right[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[right[i]]);
            sub_data = dectree_tmp[i].data.filter(function (d) {
                return d[dectree_tmp[i].feature+1]>dectree_tmp[i].threshold;
            });
            dectree_tmp[right[i]].data=sub_data;
        }

    }

    //console.log(dectree_tmp[0]);
    //treeData是参考决策树的数据名称，直接利用这个接口
    return  dectree_tmp[0];
}
function drawBasicTreeChart(data){
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        margins: {top: 80, left: 50, bottom: 50, right: 50},
        textColor: 'black',
        title: '基础树图',
        hoverColor: 'gray',
        animateDuration: 1000,
        pointSize: 5,
        pointFill: 'white',
        pointStroke: 'red',
        paddingLeft: 20,
        lineStroke: 'gray'
    }

    chart.margins(config.margins);

    /* ----------------------------数据转换------------------------  */
    chart._nodeId = 0;  //用于标识数据唯一性

    const root = d3.hierarchy(data);

    const generateTree = d3.tree()
                    .size([chart.getBodyWidth()*0.8,chart.getBodyHeight()]);

    generateTree(root);

    /* ----------------------------渲染节点------------------------  */
    chart.renderNode = function(){

        const groups = chart.body().selectAll('.g')
                                    .data(root.descendants(), (d) => d.id || (d.id = ++chart._nodeId));

        const groupsEnter = groups.enter()
                                    .append('g')
                                    .attr('class', (d) => 'g g-' + d.id)
                                    .attr('transform-origin', (d) => {    //子树从点击位置逐渐放大
                                        if (d.parent){
                                            return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                                        }
                                        return d.x + config.paddingLeft + ' ' + d.y;
                                    })
                                    .attr('transform', (d) => {    //首次渲染进入不放缩
                                        if (d.parent && chart.first) return 'scale(0.01)' + 'translate(' + (chart.oldX + config.paddingLeft) + ',' + chart.oldY + ')';
                                        return 'scale(1)' + 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')';
                                    })

              // groupsEnter.append('circle')
              //               .attr('r', config.pointSize)
              //               .attr('cx', 0)
              //               .attr('cy', 0)
              //               .attr('fill', config.pointFill)
              //               .attr('stroke', config.pointStroke);
              //
              // groupsEnter.merge(groups)
              //               .transition().duration(config.animateDuration)
              //               .attr('transform', (d) => 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')')
              //               .select('circle')
              //                   .attr('fill', (d) => d._children ? config.hoverColor : config.pointFill);
            rects = groupsEnter.selectAll('rect').data((d) => {
              dataIn =   d.data.que_value[0];
              dataOut = [];
              var pos = 0;
              for (i = 0;i<dataIn.length;i++)
              {
                    dataOut.push({value:dataIn[i],
                        name:d.data.name,
                        feature:d.data.feature,
                        threshold:d.data.threshold,
                        position:pos,
                        width:d3.sum(dataIn),
                        data:d.data.data});
                    pos+=dataIn[i]
              }
              return dataOut;
            });
                rectEnter= rects.enter().append('rect')
                    .attr('width',(d) => d.value/2)
                    .attr('height',10)
                    .attr('fill',  (d,i) => chart._colors(i))
                    .attr('x',(d) =>d.position/2-d.width/4);
                rectEnter.merge(rects);
                rects.exit().remove();


              groupsEnter.merge(groups)
                            .transition().duration(config.animateDuration)
                            .attr('transform', (d) => 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')');
              groups.exit()
                        .attr('transform-origin', (d) => (chart.targetNode.x + config.paddingLeft) + ' ' + chart.targetNode.y)  //子树逐渐缩小到新位置
                        .transition().duration(config.animateDuration)
                        .attr('transform', 'scale(0.01)')
                        .remove();


    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        d3.selectAll('.text').remove();

        const groups = d3.selectAll('.g');

        groups.append('text')
              .attr('class', 'text')
              .text((d) => d.data.name + ":"+ d.data.feature +" <" +Math.round( d.data.threshold*100)/100)
              .attr('dy', function(){
                  return chart.textDy || (chart.textDy = this.getBBox().height/4);
              })
              .attr('text-anchor', (d) =>{
                  return d.children ? 'end' : 'start';
              })
              .attr('dx', (d) =>{
                return d.children ? -config.pointSize*1.5 : config.pointSize*1.5;
            });
    }

    /* ----------------------------渲染连线------------------------  */
    chart.renderLines = function(){
        const nodesExceptRoot = root.descendants().slice(1);

        const links = chart.body().selectAll('.link')
                                .data(nodesExceptRoot, (d) => d.id || (d.id = ++chart._nodeId));

              links.enter()
                     .insert('path', '.g')
                     .attr('class', 'link')
                     .attr('transform-origin', (d) => {
                        if (d.parent){           //连线从点击位置逐渐放大
                            return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                        }
                        return d.x + config.paddingLeft + ' ' + d.y;
                    })
                    .attr('transform', (d) => {                //首次渲染进入不放缩
                        if (d.parent && chart.first) return 'scale(0.01)';
                        return 'scale(1)';
                    })
                   .merge(links)
                     .transition().duration(config.animateDuration)
                     .attr('d', (d) => {
                        return generatePath(d, d.parent);
                     })
                     .attr('transform', 'scale(1)')
                     .attr('fill', 'none')
                     .attr('stroke', config.lineStroke)

              links.exit()
                     .attr('transform-origin', (d) => {    //连线逐渐缩小到新位置
                         return chart.targetNode.x + config.paddingLeft + ' ' + chart.targetNode.y;
                     })
                     .transition().duration(config.animateDuration)
                     .attr('transform', 'scale(0.01)')
                     .remove();

        function generatePath(node1, node2){
            const path = d3.path();
            var offset = 0;

            path.moveTo(node1.x + config.paddingLeft, node1.y);
            path.bezierCurveTo(
                                 node1.x+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x+offset+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x + offset+config.paddingLeft, node2.y
                              );
            return path.toString();
        }
    }

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){

        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        d3.selectAll('.g rect')
            .on('click', function(d){
                showData = d.data;
                drawStreamChart(makeStreamData(d.data,3));
                var parallelLineData = makeParallelLineData(d.data);
                drawParallelLineChart(parallelLineData);
                tmp = $("#select_1").val();
                if(tmp == "0")
                {
                    showProjec();
                }
                else
                {
                    showFeatureScatter();
                }


                // toggle(d);
                // generateTree(root);
                // chart.renderNode();
                // chart.renderLines();
                // chart.renderText();
                // chart.addMouseOn();
            })
            .on('mouseover',function (d) {
                d3.select("#treeView").selectAll('.tip').remove();
                e = d3.event;
                position = d3.mouse(chart.svg().node());
                e.target.style.cursor = 'hand'
                chart.svg()
                    .append('text')
                    .classed('tip', true)
                    .attr('x', position[0]+5)
                    .attr('y', position[1])
                    .attr('fill', config.textColor)
                    .text( featureNames[d.feature] +" <" +Math.round( d.threshold*100)/100);
            })
            .on('mouseleave',function (d) {
                d3.select("#treeView").selectAll('.tip').remove();
            });

        function toggle(d){
            chart.first = true;
            if (d.children){
                d._children = d.children;
                d.children = null;
            }else{
                d.children = d._children;
                d._children = null;
            }
            chart.oldX = d.x;  //点击位置x坐标
            chart.oldY = d.y;  //点击位置y坐标
            chart.targetNode = d;  //被点击的节点
        }
    }

    chart.render = function(){

        // chart.renderTitle();

        chart.renderNode();

        // chart.renderText();

        chart.renderLines();

        chart.addMouseOn();

    }
    chart.box(d3.select("#treeView"));
    chart.renderChart();
}














