function draw_result() {
    var test_url = "/divide/";
    console.log(test_url)
    //console.log(tmp_tensor_data);
    var num_val = document.getElementById('cluster_num').value;
    var dectree_val = document.getElementById('dectree_num').value;
    var s ="#dectree_";
    var c ="#scatter_";
    var dectree_div =s.concat(dectree_val);
    var scatter_div=c.concat(dectree_val);
    new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            //async: false,
            url: test_url,
            data: {
                'dectree_val': dectree_val,
                'num_val':num_val,
            },
            //JSON.stringify(d.ind),
            dataType: "json",
            success: function (dataRes) {
            //console.log(dataRes);

            feature = dataRes['feature'];
            right=dataRes['children_right'];
            left=dataRes['children_left'];
            data=dataRes['data'];
            threshold=dataRes['threshold'];
            que_value=dataRes['value'];

            console.log(feature);
            d3.select(dectree_div,).select("svg").remove();
            dectree(feature, right, left, que_value, threshold, data, dectree_div, scatter_div);

                //console.log(window.og_loading_vectors);
                //函数体结束
            }
        })
    })
}