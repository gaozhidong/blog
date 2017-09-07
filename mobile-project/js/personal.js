// JavaScript Document

$(function(){
    var html="";
    var showTemp=document.getElementById("showTemp").innerHTML;
    var showTag="";
    var showUid="";
    var showUrl="";
    var showPhoto=new Array();

    //var id = $.getUrlVar('id');



function getPic(){
        $.ajax({
        url:MoonduDomain+'/photo/GetPhotoByTag',
        type:"GET",
        dataType:"jsonp",
        data:{uid:showUid,tag:showTag},
        success: function(data){ 
            data=data.Data.Rows;
            console.log(data);
        for(i=0;i<data.length;i++){
            showPhoto.push(data[i].Photo);
        }                      
        console.log(showPhoto); 
        var picList="";
        for(i=0;i<3;i++){
            picList+='<img src="'+showPhoto[i]+'">'             
            $(".show_box").find(".picLsit").append($(picList));
            } 
        }
    })
}



function myShow(){
    $.ajax({
        url:MshowDomain+'m_api.php',
        type:"GET",
        dataType:"jsonp",
        data:{action:'details',id:'147'},
        success: function(data){      
            data=data.Data;
            console.log(data);
            showTag=data.tag;
            showUid=data.uid;
            showUrl=data.img_url;
            var template = new EJS({"text": showTemp});
            html += template.render(data);
            $(".show_box").html(html);
            getPic();


        }
});
}




myShow(0);


    $(".show_edit").on("click",function(){

        $.ajax({
        url:MshowDomain+'m_api.php',
        type:"GET",
        dataType:"jsonp",
        data:{action:'set_cover',id:'147',uid:showUid,url:showUrl},
        success: function(data){      
            if(data.Result==true){
                alert("封面设置成功！");
            }
            else{
                alert("封面设置失败！");
            }


        }
});
    })


})	
    






























    // var showPic=' <a href="m-show-choice.html?id=<%=id%>" class="p_show_pic">'
        //             +'<img src="showPhoto[i]">'+
        //             '</a>';

        // $(".show_box").find(".showPic").append($(showPic)); 