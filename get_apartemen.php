<?php
include "connection.php";

// $filename = "apartemens.json";
// $filename = "aparts_bekasi.json";
// $filename = "aparts_jakarta.json";
$filename = "aparts_all.json";
// $handle = fopen($filename, "r"); // Open the CSV file for reading
$jsonString = file_get_contents($filename);
$jsonDatas = json_decode($jsonString, true);
$insert="insert into apartemen (NAME, AVAILABLE, LOCATION, PRICE_FROM) values ";
// print_r($jsonString);
// print_r($jsonDatas);
$i=1;
$totalAvailable=0;
foreach ($jsonDatas as $apartemen) {
   $available=(int) trim(trim($apartemen['available'], 'Unit Tersedia'));
//    echo $i . ". " . $apartemen['name']. ", ";
//    echo $available . ", ";
//    echo $apartemen['location'] . ", ";
//    echo (string)$apartemen['price'] . "\n";
   $insert.="('" . str_replace("'", " ", $apartemen['name']) . "'," .
       $available . ",'" . 
        trim($apartemen['location']) . "'," . 
        unformatted(trim(explode("/",replaceNbspWithChar($apartemen['price']))[1])) . "),";
   $totalAvailable+=$available;
   $i++;
}   
 
echo "\nJumlah Apartemen= " . $i-1;
echo "\nJumlah unit tersedia= " . number_format((string)$totalAvailable);
echo "\nRatio per Apartemen= " . (int) ($totalAvailable/($i-1)). "\n\n";
$insert= substr($insert,0,strlen($insert)-1);
// echo $insert . ";\n";
if ($conn->query($insert) === TRUE) {
        echo $i-1 . " rows have been inserted successfully. \n";
} else {
        echo "ERROR";
}

function unformatted ($x) {

        $number=str_replace("," , "", $x);
      
        return $number;
    }

function replaceNbspWithChar($content){
	$string = htmlentities($content);
	$content = str_replace("&nbsp;", "/", $string);
	$content = html_entity_decode($content);
	return $content;
}
    
?>