<?php

//DEBUG 请求获取一页列表数据例子
$page = max(1, intval($_GET['page']));
$perpage = $limit = 10;
$start=(($page-1) * $perpage);

$search_keyword = isset($_GET['search_keyword']) ? $_GET['search_keyword'] : '';
if($search_keyword){
	$sql_info = "SELECT * FROM ".DB::table('content')." WHERE title LIKE '%".$search_keyword."%' AND isdelete=0 ORDER BY info_id DESC ".DB::limit($start, $limit);
	$sql_info_result = DB::fetch_all($sql_info);
	$sql_total_rows = "SELECT count(*) FROM ".DB::table('content')." WHERE title LIKE '%".$search_keyword."%' AND isdelete=0 ";
	$sql_total_rows_result = DB::result_first($sql_total_rows);
	$multipage = multi($sql_total_rows_result, $perpage, $page, "index.php?mod=index&action=search&search_keyword=".$search_keyword);
}
include template('index/index_search');