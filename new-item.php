<?php

///////////////////////////////////////
// ASK THE USER WHAT HE WANTS TO ADD //
///////////////////////////////////////

$blogpost = false;
$assignment = false;

echo "\n";
echo".  .       .        ,-.                     
|\ | o     |       (   `                    
| \| . ,-. | ,-.    `-.  ,-. ,-: ,-. ;-. ,-.
|  | | |-' | `-.   .   ) |-' | | |-' |   `-.
'  ' ' `-' ' `-'    `-'  `-' `-| `-' '   `-'
			     `-'            ";
echo "\n\nWhat would you like to add? 1 to add a blogpost or 2 to add an assignment. Or input anything else to exit the script.\n\n";
$handle_choice = fopen ("php://stdin","r");
$choice = fgets($handle_choice);

if(trim($choice) == '1'){
	$blogpost = true;
}
if(trim($choice) == '2'){
	$assignment = true;
}
if(trim($choice) != '1' || trim($choice) == '2'){
	echo "\n";
	echo "ABORTING!\n";
	exit;
}



//////////////////////////////////////
/// ADD NEW BLOGPOST TO FRONTPAGE ////
//////////////////////////////////////

if($blogpost == true){
// get title of post
	echo "\nTitle of new post: ";
	$handle_title = null;
	$handle_title = fopen("php://stdin","r");
	$title = fgets($handle_title);

// get content for post
	echo "Content of new post: ";
	$handle_content = null;
	$handle_content = fopen("php://stdin","r");
	$content = fgets($handle_content);

// check if new post is correct, if so push it to git, if not abort
	echo "\nYour current post looks like this:\n\n";
	echo "Title: " . $title;
	echo "Content: " . $content."\n\n";
	echo "Does this look correct?  Type 'yes' to continue: ";
	$handle = fopen ("php://stdin","r");
	$line = fgets($handle);
	if(trim($line) == 'yes'){	
		// transform command line input into new blog post in html file
		$path_to_file = './index.html';
		$file_contents = file_get_contents($path_to_file);
		$file_contents = str_replace('<div class="post-preview">','<div class="post-preview">' . "\n\t\t\t\t\t\t" . '<div class="post">'. "\n\t\t\t\t\t\t\t" .'<h2 class="post-title">'. "\n\t\t\t\t\t\t\t\t" . $title . "\t\t\t\t\t\t\t" . '</h2>'. "\n\t\t\t\t\t\t\t" .'<h3 class="post-subtitle">'. "\n\t\t\t\t\t\t\t\t" . $content . "\t\t\t\t\t\t\t" . '</h3>'. "\n\t\t\t\t\t\t"	 .'</div>'. "\n\t\t\t\t\t\t" .'<hr>',$file_contents);
		file_put_contents($path_to_file,$file_contents);
		// push to git
		exec("git add .");
		exec("git commit -m 'new post'");
		exec("git push");
	}
	else{
		echo "\n";
		echo "ABORTING!\n";
		exit;
	}
}



//////////////////////////////////////
// ADD NEW ASSIGNMENT TO SCHOOL TAB //
//////////////////////////////////////

if($assignment == true){
// get title of assignment
	echo "\n";
	echo "Title of new assignment: ";
	$handle_title = null;
	$handle_title = fopen("php://stdin","r");
	$title = rtrim(fgets($handle_title),"\r\n"); //Remove the newline/whitespace from the end of the input
	
	// get link for assignment
	echo "URL link to assignment pdf file: ";
	$handle_link = null;
	$handle_link = fopen("php://stdin","r");
	$link = rtrim(fgets($handle_link),"\r\n"); //Remove the newline from the end of the input
	
	// check if new assignment is correct, if so push it to git, if not abort
	echo "\nNew assignment:\n\n";
	echo "Title: " . $title . "\n";
	echo "URL: " . $link."\n\n";
	echo "Does this look correct?  Type 'yes' to continue: ";
	$handle = fopen ("php://stdin","r");
	$line = fgets($handle);
	if(trim($line) == 'yes'){
		// transform command line input into new assignment post in html file
		$path_to_file = 'html/school.html';
		$file_contents = file_get_contents($path_to_file);
		$file_contents = str_replace('<h2 class="post-title">I3Talent</h2>','<h2 class="post-title">I3Talent</h2>' . "\n\t\t\t\t\t\t" . '<p><b>Assignment: '. $title .'</b></p>'. "\n\t\t\t\t\t\t	" . 	'<iframe width="100%" height="1000px" src="' . $link . '" type="application/pdf"></iframe>',$file_contents);
		file_put_contents($path_to_file,$file_contents);
		// push to git
		exec("git add .");
		exec("git commit -m 'new assignment'");
		exec("git push");
	}
	else{
		echo "\n";
		echo "ABORTING!\n";
		exit;
	}
}
?>