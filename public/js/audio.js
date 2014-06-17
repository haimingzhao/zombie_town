
document.getElementById('loop').addEventListener('timeupdate', function(){
	// Buffer time to reduce delay in loop
	var buffer = 0.2;
	if(this.currentTime > this.duration - buffer){
		this.currentTime = 0;
		this.play();
	}
	
}, false);
