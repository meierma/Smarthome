<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
ini_set('display_errors', 'On');
error_reporting(E_ALL);

require_once("ClimateNEW.php");

$climate = new Climate();
$task = $_GET['task'];

if ($task == "initClimateData") {
    $climate->initClimateData();
} elseif ($task == "resetClimateData") {
    $climate->resetClimateData();
} elseif ($task == "addClimateData") {
    $climate->insertClimateDataIntoDB();
}
?>
