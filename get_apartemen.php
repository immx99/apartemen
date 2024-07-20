<?php
include "connection.php";

// $filename = "apartemens.json";
// $filename = "aparts_bekasi.json";
// $filename = "aparts_jakarta.json";
$filename = "aparts_all.json";
$handle = fopen($filename, "r"); // Open the CSV file for reading
$jsonString = file_get_contents($filename);
$jsonDatas = json_decode($jsonString, true);
$insert="insert into apartemen (NAMA_APARTEMEN, TERSEDIA, LOKASI) values ";
// print_r($jsonString);
// print_r($jsonDatas);
foreach ($jsonDatas as $apartemen) {
   echo $apartemen['apartemen']. ", ";
   echo $apartemen['tersedia'] . ", ";
//    echo "Tangerang" . ", ";
   echo $apartemen['lokasi'] . "<br>";
   $insert.="('" . $apartemen['apartemen'] . "'," . 
        (int) trim(trim($apartemen['tersedia'], 'Unit Tersedia')) . ",'','" . 
        trim($apartemen['lokasi']) . "'),";

}   
echo substr($insert,0,strlen($insert)-1) . ";"; 

?>