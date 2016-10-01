<?php
// get title of post
echo "Title of new post: ";
$stdin = fopen('php://stdin', 'r');
$title = fgetc($stdin);
// get content for post
echo "Content of new post: ";
$stdin = fopen('php://stdin', 'r');
$content = fgetc($stdin);
// transform command line input into new blog post in html file
$data = file('index.html');
function replace_a_line($data) {
   if (stristr($data, '<div class="post-preview">')) {
     return "<div class='post-preview'>
     			<div class='post'>
                	<h2 class='post-title'>" 
                		. $title . 
                	"</h2>
                	<h3 class='post-subtitle'>"
                		. $content . 
                	"</h3>
            	</div>
            	<hr>";
   }
   return $data;
}
$data = array_map('replace_a_line',$data);
file_put_contents('index.html', implode('', $data));
exec("git add .");
exec("git commit -m 'new post'");
exec("git push");
?>