<?php
// get title of post
echo "Title of new post: ";
$handle_title = null;
$handle_title = fopen("php://stdin","r");
$title = fgets($handle_title);

// get content for post
echo "Content of new post: ";
$handle_content = null;
$handle_content = fopen("php://stdin","r");
$content = fgets($handle_content);

// transform command line input into new blog post in html file
$path_to_file = './index.html';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace('<div class="post-preview">','<div class="post-preview">' . "\n\t\t\t\t\t\t" . '<div class="post">'. "\n\t\t\t\t\t\t\t" .'<h2 class="post-title">'. "\n\t\t\t\t\t\t\t\t" . $title . "\t\t\t\t\t\t\t" . '</h2>'. "\n\t\t\t\t\t\t\t" .'<h3 class="post-subtitle">'. "\n\t\t\t\t\t\t\t\t" . $content . "\t\t\t\t\t\t\t" . '</h3>'. "\n\t\t\t\t\t\t" .'</div>'. "\n\t\t\t\t\t\t" .'<hr>',$file_contents);
file_put_contents($path_to_file,$file_contents);

// check if new post is correct, if so push it to git, if not abort
echo "\nYour current post looks like this:\n\n";
echo "Title: " . $title;
echo "Content: " . $content."\n\n";
echo "Does this look correct?  Type 'yes' to continue: ";
$handle = fopen ("php://stdin","r");
$line = fgets($handle);
if(trim($line) == 'yes'){
	exec("git add .");
	exec("git commit -m 'new post'");
	exec("git push");
}
else{
	echo "\n";
    echo "ABORTING!\n";
    exit;
}
?>