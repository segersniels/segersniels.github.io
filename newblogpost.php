<?php
// get title of post
echo "Title of new post: ";
$handle_title = fopen("php://stdin","r");
$title = fgets($handle_title);

// get content for post
echo "Content of new post: ";
$handle_content = fopen("php://stdin","r");
$content = fgets($handle_content);

// transform command line input into new blog post in html file


//test

$path_to_file = 'index.html';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace("<div class='post-preview'>","<div class='post-preview'><div class='post'><h2 class='post-title'>" . $title . "</h2><h3 class='post-subtitle'>". $content . "</h3></div><hr>",$file_contents);
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