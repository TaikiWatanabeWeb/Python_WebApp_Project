var video_elem = document.getElementById("my_video_1");

video_elem.addEventListener('timeupdate', function () {
  console.log(video_elem.currentTime);
});

const animateButton = e => {
  e.preventDefault;
  e.target.classList.remove('animate'); //reset animation

  e.target.classList.add('animate');
  setTimeout(() => e.target.classList.remove('animate'), 400);
};

const bubblyButtons = document.getElementsByClassName('bubbly-button');

for (let i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}

//Ajaxでいいね押された時の処理
$(function () {
  var commcount=0;

  $(".goodbutton").click(function () {
    //いいねの数取得
    var SpanText=$("#counter").text();
    var NumberOfLikes=parseInt(SpanText)
    //いいねの数を+1
    NumberOfLikes+=1

    //HTMLに反映
    $("#counter").text(NumberOfLikes);

    //条件検索のための動画名取得
    var Video_name=getVideoName();
    //Databaseにも反映
    ConnectMySQLThrowNumberOfLikes(NumberOfLikes,Video_name);
  });

  //コメント送信機能反映
  $('.btn-primary').click(function(){
    //テキストボックスの中身取得
    var comment=$("#input1").val();
    commcount+=1;
    //HTML反映
    $(".com-elm").clone(true).removeClass("com-elm").addClass("comment-main-level"+commcount).appendTo("#comments");
    $(".comment-main-level"+commcount).find(".comment-content").text(comment);
    //POST送信
    var videoname=getVideoName();

    //日付取得
    var ComDate=new Date();
    var PostedCommentDate=ComDate.getFullYear()+"-"+Number(ComDate.getMonth()+1)+"-"+ComDate.getDate();

    $(".comment-main-level"+commcount).find("#com-date").text(PostedCommentDate);

    ConnectMySQLThrowVideoComment(comment,videoname,PostedCommentDate)

    $("#input1").val("");
  });

  $(".delete-com").click(function(){
    var vd_name=getVideoName();
    var comtext=$(this).parent().parent().next().text();
    
    var trtext= comtext.replace(/\r?\n/g,"");
    var TargetString = trtext.replace(/\s+/g, "");
    //DB処理
    DeleteCommentDataBase(vd_name,TargetString);

    //HTML反映処理書こう
  $(this).parent().parent().parent().slideUp(2000);
  });
});

function DeleteCommentDataBase(video_name,comtext){
  $.ajax({
    url:'/delete',
    type:'POST',
    data:{
      videoname:video_name,
      comment:comtext
    }
  });
}

function ConnectMySQLThrowVideoComment(comment,videoname,PostedCommentDate){
  $.ajax({
    url:'comments',
    type:'POST',
    data:{
      comment:comment,
      videoname:videoname,
      date:PostedCommentDate
    }
  });
}

function ConnectMySQLThrowNumberOfLikes(Likes,video_name){

  $.ajax({
    url:'/likes',
    type:'POST',
    data:{
      number_of_likes:Likes,
      videoname:video_name
    }
  });
}

function getVideoName(){
  var Video_name=$('.video-p-title').text();
  return Video_name;
}