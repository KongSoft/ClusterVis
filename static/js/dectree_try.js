function dectree(feature,right,left,que_value,threshold,retdata,div1,div2) {

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
                return d[dectree_tmp[i].feature]< dectree_tmp[i].threshold;
            });
            dectree_tmp[left[i]].data=sub_data;

            //dectree_tmp[i].da
        }
        if (right[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[right[i]]);
            sub_data = dectree_tmp[i].data.filter(function (d) {
                return d[dectree_tmp[i].feature]>dectree_tmp[i].threshold;
            });
            dectree_tmp[right[i]].data=sub_data;
        }

    }
    
    //console.log(dectree_tmp[0]);
    //treeData是参考决策树的数据名称，直接利用这个接口
    var treeData = [];
    treeData[0] = dectree_tmp[0];

    // ************** Generate the tree diagram  *****************
    //定义树图的全局属性（宽高）
    var margin = { top: 20, right:10, bottom: 10, left: 10 },
        width = 960 - margin.right - margin.left,
        height = 440 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,//过渡延迟时间
        root;

    var tree = d3.layout.tree()//创建一个树布局
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.x, d.y]; });//创建新的斜线生成器

    //声明与定义画布属性
    var svg = d3.select(div1).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[0];//treeData为上边定义的节点属性
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", "500px");

    function update(source) {

        // Compute the new tree layout.计算新树图的布局
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);
        //console.log(nodes);
        // Normalize for fixed-depth.设置y坐标点，每层占180px
        nodes.forEach(function (d) { d.y = d.depth * 100; });
        nodes.forEach(function (d) { d.x = d.x * 1.2; });

        // Update the nodes…每个node对应一个group
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });//data()：绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

        // Enter any new nodes at the parent's previous position.新增节点数据集，设置位置
        var nodeEnter = node.enter().append("g")  //在 svg 中添加一个g，g是 svg 中的一个属性，是 group 的意思，它表示一组什么东西，如一组 lines ， rects ，circles 其实坐标轴就是由这些东西构成的。
            .attr("class", "node") //attr设置html属性，style设置css属性
            .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
            .on("click", click);

        //添加连接点---此处设置的是圆圈过渡时候的效果（颜色）
        // nodeEnter.append("circle")
        //   .attr("r", 1e-6);//d 代表数据，也就是与某元素绑定的数据。

        nodeEnter.append("path");
        nodeEnter.append("title")
            .text(function (d) {
                return d.feature + " [" + d.que_value + "]   " + d.threshold.toFixed(3);
            });

        //添加标签
        // var text = nodeEnter.append("text")
        //     //.attr("x", function(d) { return d.children || d._children ? -13 : 13; })
        //     .attr("x", function (d) { return 13; })
        //     .attr("y", 0)
        //     //.attr("dy", ".35em")
        //     .attr("dy", ".35em")
        //     .attr("text-anchor", function (d) { return "start"; })
        //     .text(function (d) { return d.feature + "  [" + d.que_value + "]  " + d.threshold.toFixed(2); })
        //     .style("fill-opacity", 1e-6);
        //text.selectAll("tspan")
        //   .data(nodes) 
        //   .enter() 
        //    .append("tspan") 
        //   .attr("x",text.attr("x")) 
        //   .attr("dy","1em") 
        //  .text(function(d,i){ 
        //   return d[i].feature; 
        //   });

        // Transition nodes to their new position.将节点过渡到一个新的位置-----主要是针对节点过渡过程中的过渡效果
        //node就是保留的数据集，为原来数据的图形添加过渡动画。首先是整个组的位置
        var nodeUpdate = node.transition()  //开始一个动画过渡
            .duration(duration)  //过渡延迟时间,此处主要设置的是圆圈节点随斜线的过渡延迟
            .attr("r", 10)
            .attr("transform", function (d) {
                //console.log(d.x);
                //console.log(d.y);
                return "translate(" + d.x + "," + d.y + ")";
            });
        //console.log(nodeUpdate )
        //更新连接点的填充色
        // nodeUpdate.select("circle")
        // .attr("r", 10)
        // .attr('class',function(d){
        //   if(d.value <= 9){
        //     return 'bling';
        //   }else{
        //     return 'fill_normal';
        //   }
        // });
        nodeUpdate.select("path")
            .style("stroke-width", "2px")
            .style("stroke", "#4682b4")
            .style("fill", "white")
            .attr("d", d3.svg.symbol()
                .size(function (d) {
                    //console.log(d)
                    if (d.children == null) { return "60"; } else if
                        (d.children.length > 0) { return "400"; }
                })
                .type(function (d) {
                    if
                        (d.children == null) { return "triangle-up"; } else if
                        (d.children.length > 0) { return "circle"; }
                }))
            .attr('class', function (d) {
                if (d.que_value[0] + d.que_value[1] <= 9) {
                    return 'bling';
                } else {
                    return 'bling';
                }
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.过渡现有的节点到父母的新位置。
        //最后处理消失的数据，添加消失动画
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…线操作相关
        //再处理连线集合
        var link = svg.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        //添加新的连线
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });  //diagonal - 生成一个二维贝塞尔连接器, 用于节点连接图.
            })
            .style("stroke", function (d) {
                //d包含当前的属性console.log(d)
                return '#ccc';
            });

        // Transition links to their new position.将斜线过渡到新的位置
        //保留的连线添加过渡动画
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.过渡现有的斜线到父母的新位置。
        //消失的连线添加过渡动画
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.将旧的斜线过渡效果隐藏
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    drawScatter(div2, retdata,{data:[]});
    //定义一个将某节点折叠的函数
    // Toggle children on click.切换子节点事件
    //结点第二次点击显示子结点时会报错（动画），但不影响结果
    function click(d) {
        //if (d.children) {
        //    d._children = d.children;
         //   d.children = null;
        //} else {
          //  d.children = d._children;
          //  d._children = null;
        //}
        //update(d);
        console.log(div2)
        drawScatter(div2,retdata,d);
    }

};