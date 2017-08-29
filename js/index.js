function search(vals){
    // 查询省份列表
    for(var i=0;i<ProvinceArray.length;i++){
        // 判断匹配成功
        if(ProvinceArray[i][0].indexOf(vals)>-1){

            // 滚动到对应位置
            $(".GetProvince").scrollTop($(".GetProvince li").outerHeight(false)*i);

            // 同步更新城市数据
            cityGetProvince();
            return false;
        }
    }
    
    // 声明一个变量用于存储当前是省份下的第几个城市
    var CityArrayNum=0;

    // 查询城市列表
    for(var i=0;i<CityArray.length;i++){
        if(i>1){

            // 若是另一个省份下的城市
            if(CityArray[i][0]!=CityArray[i-1][0]){

                // 位置归零
                CityArrayNum=0;
            }else{

                // 否则累加
                CityArrayNum++
            }
        }

        // 判断匹配成功
        if(CityArray[i][1].indexOf(vals)>-1){

            // 获取省份的位置,并滚动到显示区
            var n=$(".GetProvince li[data-id='"+CityArray[i][0]+"']").index()-SetCityGap;
            $(".GetProvince").scrollTop($(".GetProvince li").outerHeight(false)*n);

            // 同步获取城市
            cityGetProvince();

            // 根据匹配成功的位数调整城市显示区
            $(".GetCity").scrollTop($(".GetProvince li").outerHeight(false)*CityArrayNum)
            return false;
        }
    }
    

     // 声明一个变量用于存储当前是城市下的第几个区域
    var ProvinceArrayNum=0;

    // 查询区域列表
    for(var i=0;i<CityAreaArray.length;i++){
        if(i>1){

            // 若是另一个城市下的区域
            if(CityAreaArray[i][0]!=CityAreaArray[i-1][0]){

                // 位置归零
                ProvinceArrayNum=0;
            }else{

                // 否则累加
                ProvinceArrayNum++
            }
        }
       

       // 判断匹配成功
        if(CityAreaArray[i][1].indexOf(vals)>-1){

            // 获取父级城市ID
            var parentId=CityAreaArray[i][0];
            var proNum,cityNum,areaNum;

            // 查找城市列表
            for(var j=0;j<CityArray.length;j++){

                // 找到对应城市
                if(CityArray[j][2]==parentId){

                    // 根据城市定位省份
                    var n=$(".GetProvince li[data-id='"+CityArray[j][0]+"']").index()-2;
                    $(".GetProvince").scrollTop($(".GetProvince li").outerHeight(false)*n);

                    // 同步更新城市数据
                    cityGetProvince();

                    // 更新城市显示位置
                    var n=$(".GetCity li[data-id='"+parentId+"']").index()-2;
                    $(".GetCity").scrollTop($(".GetProvince li").outerHeight(false)*n);

                    // 同步更新区域数据
                    cityGetCityArea();
                    
                    // 根据对应位数更新区域显示区
                    setTimeout(function(){
                        var nums=$(".GetProvince ").scrollTop()==0?ProvinceArrayNum+1:ProvinceArrayNum;
                        $(".GetCityArea").scrollTop($(".GetProvince li").outerHeight(false)* nums)
                    },0)
                    return false;										
                }
            }
            return false;
        }
    }
};


// 监听是否滚动完成
function scrollEnd(obj,fn){
    var oldTop=$(obj).scrollTop();
    function getScrollTop(){
        if($(obj).scrollTop()==oldTop){
            fn();
        }else{
            oldTop=$(obj).scrollTop();
            setTimeout(getScrollTop,50)
        };
    };
    setTimeout(getScrollTop,50)
};


// 设定差值
var SetCityGap=2;
$(document).ready(function(){
   // 省份滚动
   $(".GetProvince").on({
       "touchend":function(){
    	   var obj=$(this);
    	   obj.addClass("isScrolling");
           scrollEnd($(this),function(){
                var lih=$(".GetProvince li").outerHeight(false);
                var n=Math.round($(".GetProvince").scrollTop()/lih);
                $(".GetProvince").scrollTop(lih*n);
                obj.removeClass("isScrolling");
                cityGetCity();
           });
       }
   });

    // 城市滚动
   $(".GetCity").on({
       "touchend":function(){
    	   var obj=$(this);
    	   obj.addClass("isScrolling");
           scrollEnd($(this),function(){
                var lih=$(".GetCity  li").outerHeight(false);
                var n=Math.round($(".GetCity ").scrollTop()/lih);
                $(".GetCity ").scrollTop(lih*n);
                obj.removeClass("isScrolling");
                cityGetCityArea();
           });
       }
   });

   // 区域滚动  
   $(".GetCityArea").on({
       "touchend":function(){
    	   var obj=$(this);
    	   obj.addClass("isScrolling");
           scrollEnd($(this),function(){
                var lih=$(".GetCity  li").outerHeight(false);
                var n=Math.round($(".GetCityArea").scrollTop()/lih);
                $(".GetCityArea").scrollTop(lih*n);
                obj.removeClass("isScrolling");
           });
       }
   });

   // 初始化    
   cityGetProvince();
});


// 获取省份
function cityGetProvince(){
    var pro="";
    for(var i=0;i<SetCityGap;i++){
        pro+="<li></li>";
    };
    for(var i=0;i<ProvinceArray.length;i++){
        pro+="<li data-id='"+ProvinceArray[i][1]+"'>"+ProvinceArray[i][0]+"</li>";
    };
    for(var i=0;i<SetCityGap;i++){
        pro+="<li></li>";
    };

    // 填充省份
    $(".GetProvince").html(pro)

    // 执行城市搜索
    cityGetCity();
};


// 获取城市
function cityGetCity(){

    // 获取省份位置
    var lih=$(".GetProvince li").outerHeight(false);
    var n=Math.round($(".GetProvince").scrollTop()/lih)+SetCityGap;
    var city="";
    for(var i=0;i<SetCityGap;i++){
        city+="<li></li>";
    };

    // 根据省份位置获取省份ID
    var parentId=$(".GetProvince li").eq(n).attr("data-id");

    // 获取对应省份下的城市
    for(var i=0;i<CityArray.length;i++){
        if(CityArray[i][0]==parentId){
            city+="<li data-id='"+CityArray[i][2]+"'>"+CityArray[i][1]+"</li>";
        };
    };
    for(var i=0;i<SetCityGap;i++){
        city+="<li></li>";
    };

    //填充城市列表
    $(".GetCity").scrollTop(0).html(city);

    // 执行区域数值获取事件
    setTimeout(cityGetCityArea,0);
};


// 获取区域
function cityGetCityArea(){
    var lih=$(".GetCity li").outerHeight(false);

    // 获取市级位置
    var n=Math.round(parseInt($(".GetCity").scrollTop())/lih)+SetCityGap;
    var area="";
    for(var i=0;i<SetCityGap;i++){
        area+="<li></li>";
    };

    // 根据市级位置获取城市ID
    var parentId=$(".GetCity li").eq(n).attr("data-id");

    // 获取对应城市下的区域
    for(var i=0;i<CityAreaArray.length;i++){
        if(CityAreaArray[i][0]==parentId){
            area+="<li data-id='"+CityAreaArray[i][2]+"'>"+CityAreaArray[i][1]+"</li>";
        };
    };
    for(var i=0;i<SetCityGap;i++){
        area+="<li></li>";
    };

    // 填充区域，并默认选择第一个
    $(".GetCityArea").scrollTop(0).html(area);
};

var commonAddressCityObj={};
function getCityVal(){
	if(!$("#cityList").is(":hidden")){
		commonAddressCityObj.province={
			"id":$(".GetProvince li").eq(Math.round($(".GetProvince").scrollTop()/$(".GetProvince li").outerHeight(false))+SetCityGap).attr("data-id"),
			"name":$(".GetProvince li").eq(Math.round($(".GetProvince").scrollTop()/$(".GetProvince li").outerHeight(false))+SetCityGap).html()
		}
		
		commonAddressCityObj.city={
			"id":$(".GetCity li").eq(Math.round($(".GetCity").scrollTop()/$(".GetCity li").outerHeight(false))+SetCityGap).attr("data-id"),
			"name":$(".GetCity li").eq(Math.round($(".GetCity").scrollTop()/$(".GetCity li").outerHeight(false))+SetCityGap).html()
		}
		
		commonAddressCityObj.cityArea ={
			"id":$(".GetCityArea  li").eq(Math.round($(".GetCityArea ").scrollTop()/$(".GetCityArea  li").outerHeight(false))+SetCityGap).attr("data-id"),
			"name":$(".GetCityArea  li").eq(Math.round($(".GetCityArea ").scrollTop()/$(".GetCityArea  li").outerHeight(false))+SetCityGap).html()
		}
		
		commonAddressCityObj.viewName=commonAddressCityObj.province.name+" "+commonAddressCityObj.city.name+" "+commonAddressCityObj.cityArea.name;
	}
	
	return commonAddressCityObj;
}



$(function(){
	$(".cityListBg").on({
		"touchmove":function(e){
			e.stopPropagation();
			e.preventDefault();
		}
	})
	
	$(".cityListSearch").on({
		"input":function(){
			search($(this).val().replace(/\s/g,""))
		}
	});
	
	 
    $(".cityListSub").click(function(){
    	if($(".isScrolling").length>0) return;
		$(".change_this").html(getCityVal().viewName).removeClass("defaute");
		$(".change_this").removeClass("change_this");
		setTimeout(function(){
			$("#cityList,.cityListBg").hide();
		})
	});
	
    
    $(".cityListShow").click(function(){
    	cityGetProvince();
    	$(".change_this").removeClass("change_this");
    	$(this).find(".addr_name").addClass("change_this");
		$("#cityList,.cityListBg").show();
    	$(".GetProvince").scrollTop("0")
	});
	

	$(".cityListReset").click(function(){
		$("#cityList,.cityListBg").hide();
	});
	
})
