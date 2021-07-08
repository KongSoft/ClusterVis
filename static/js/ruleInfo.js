function showRuleInfo(rules) {
    //d3.select("#ruleInfoView").selectAll("div").remove();
    //divs = d3.select("#ruleInfoView").selectAll("div").data(rules);
    //divs = divs.enter().append("div");
    //divs.each(function (d,i) {
     //   showRuleDInfo(this,d,i);
        // let div = d3.select(this);
        // div.append("div").style("display","inline-block").style("width","200px").style("height","100px");
    //});
    let max = 0,index = 0;
    for (let i =0;i<rules.length;i++)
    {

        if(rules[i].support>=max)
        {
            max = rules[i].support;
            index = i;
        }
    }
    ruleIndex = index;
    showSingleRuleInfo(rules[index]);
}
function showSingleRuleInfo(rule) {
    let d = d3.select("#singleRuleInfoView");
    d.selectAll("div").remove();
    let con = d.append("div").attr("class","ruleCon");
     let node = rule.nodelist;
    let parent = node.parent;
    let showtext = node.data.text;
    showRuleRiver(parent,showtext,con,node.data.brotherOrder)
    node = parent;
    while(node.parent != null)
    {
        parent = node.parent;
        showtext = node.data.text;
        con =d.insert("div",".ruleCon:nth-child(1)").attr("class","ruleCon");
        showRuleRiver(parent,showtext,con,node.data.brotherOrder)
        node = parent;
    }
}
function showRuleDInfo(div,rule,i) {
    let d = d3.select(div);
    let con = d.append("div").attr("class","ruleCon").style("display","inline-block").style("width","100px").style("height","100px");
    con.append("div").text("规则"+i);
    con.append("div").text("支持度"+i);
    con.append("div").text("置信度"+i);
    con =d.insert("div").attr("class","ruleCon").style("display","inline-block").style("width","200px").style("height","100px");
    let node = rule.nodelist;
    let parent = node.parent;
    let showtext = node.data.text;
    node = parent;
    showRuleRiver(parent,showtext,con)
    while(node.parent != null)
    {
        parent = node.parent;
        showtext = node.data.text;
        con =d.insert("div",".ruleCon:nth-child(2)").style("display","inline-block").style("width","200px").style("height","100px");
        showRuleRiver(parent,showtext,con)
        node = parent;
    }
    d.append("div").attr("class","ruleCon").style("display","inline-block").style("width","100px").style("height","100px").text("支持度"+rule.support.toFixed(2));
    d.append("div").attr("class","ruleCon").style("display","inline-block").style("width","100px").style("height","100px").text("置信度"+rule.confidence.toFixed(2));


}
function  showRuleRiver(node,showtext,con,Order) {
 drawStreamChart(makeStreamData(node.data,typek,Order),typek,con,showtext);
}