	jmp = new Array();
	img = new Array();
	jmp[0] = "org.appplus.tadpolewarOasis";
	jmp[1] = "jp.co.bike8190";
	jmp[2] = "app.roms";
	jmp[3] = "jp.darksummoner";
	img[0] = "http://android.giveapp.jp/pr_detail/img/12.gif";
	img[1] = "http://android.giveapp.jp/pr_detail/img/11.gif";
	img[2] = "http://android.giveapp.jp/pr_detail/img/10.gif";
	img[3] = "http://android.giveapp.jp/pr_detail/img/9.gif";
	document.write("<a style='width:100%;' href='market://details?id="+jmp[n]+" onclick='SDK.registCpiByStaffReview('"+jmp[n]+"')>");
	document.write("<img src='"+img[n]+"' width='100%'>");
	document.write("</a>");