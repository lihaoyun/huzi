document.querySelector('header a').addEventListener('click',function(){
	//window.history.go(-1);
	window.history.back();
	window.location.reload();
	console.log(111);
},false);