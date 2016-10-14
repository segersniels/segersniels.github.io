<?php
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

// transform command line input into new assignment post in html file
$path_to_file = 'html/school.html';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace('<h2 class="post-title">I3Talent</h2>','<h2 class="post-title">I3Talent</h2>' . "\n\t\t\t\t\t\t" . '<p><b>Assignment: '. $title .'</b></p>'. "\n\t\t\t\t\t\t" . '<iframe width="100%" height="1000px" src="' . $link . '" type="application/pdf"></iframe>',$file_contents);
file_put_contents($path_to_file,$file_contents);

// check if new assignment is correct, if so push it to git, if not abort
echo "\nNew assignment:\n\n";
echo "Title: " . $title . "\n";
echo "URL: " . $link."\n\n";
echo "Does this look correct?  Type 'yes' to continue: ";
$handle = fopen ("php://stdin","r");
$line = fgets($handle);
if(trim($line) == 'yes'){
	exec("git add .");
	exec("git commit -m 'new assignment'");
	exec("git push");
}
else{
	echo "\n";
    echo "ABORTING!\n";
    exit;
}
?>