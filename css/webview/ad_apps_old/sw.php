<?php
$mysqli = new SsgnMysqli('giveapp@localhost');
$ad_apps_id = $PARA_LEVEL2;
$today_datetime = date('Y/m/d H:i:s');
$sql = "SELECT * FROM AppC.cpi_tbl_ad_apps 
	WHERE ad_apps_id = '$ad_apps_id' AND 
		status = 1 AND 
		start_datetime <= '$today_datetime' AND 
		end_datetime >= '$today_datetime' AND 
		limit_result > number_of_results AND 
		disp_appc_flg = 1";
$res = $mysqli->query($sql);
$row = $res->fetch_assoc();
$Smarty->assign('TITLE','Pr');
$Smarty->assign('package',$row['package']);
$contents =  $Smarty->fetch("pr_detail/detail.html");

$Smarty->assign('contents',$contents);
$Smarty->display('pr_detail/template.html');
?>
