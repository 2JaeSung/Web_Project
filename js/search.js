// when click search button
$("#find").click(function(){
  var string = $(".form-control").val();
  sessionStorage.clear();
  sessionStorage.setItem("search", string);
})

// when press enter in input field
$(".form-control").keydown(function(key){
	if(key.keyCode == 13 ){
    var string = $(".form-control").val();
    sessionStorage.clear();
    sessionStorage.setItem("search", string);
    window.location.href = "charts.html";
	}
});
