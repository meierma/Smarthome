<?php

$Call = $_GET['Call'];

//-----------------Login MySQL Server-----------------
$config = parse_ini_file("../../config/config.ini");

$MySQL_IP = $config["database_hostname"];
$MySQL_Username = $config["database_username"];
$MySQL_Password = $config["database_password"];
$MySQL_Database = $config["database_name"];
//----------------------------------------------------

$Device = getDeviceIDbyIP($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, get_client_ip());

if($Device != ""){
  if($Call == "getRegTSensors"){ getRegTSensors($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, $Device); }
  if($Call == "addTempHumData"){ addTempHumData($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, $Device); }
}

function get_client_ip() {
    return "192.168.0.152";
}


function getDeviceIDbyIP($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, $IP)
{
  $con = mysqli_connect($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database);
  $sql = "SELECT Device_ID FROM devices WHERE IP_Adress = '$IP'";

  $result = mysqli_query($con, $sql) or die (mysqli_error());
  $Device_ID = "";
  while($row = mysqli_fetch_array($result))
  {

    $Device_ID = $row['Device_ID'];

    $Device_ID = stripcslashes(utf8_encode($Device_ID));

  }
  mysqli_close($con);
  return $Device_ID;
}

function getRegTSensors($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, $Device_ID)
{
  $con = mysqli_connect($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database);
  $sql = "SELECT TSensor_ID, TSensor_Name, GPIO, Sensor FROM tempSensors WHERE Device_ID = '$Device_ID'";

  $result = mysqli_query($con, $sql) or die (mysqli_error());
  while($row = mysqli_fetch_array($result))
  {

    $TSensor_ID = $row['TSensor_ID'];
    $TSensor_Name = $row['TSensor_Name'];
    $GPIO = $row['GPIO'];
    $Sensor = $row['Sensor'];

    $TSensor_ID = stripcslashes(utf8_encode($TSensor_ID));
    $TSensor_Name = stripcslashes(utf8_encode($TSensor_Name));
    $GPIO = stripcslashes(utf8_encode($GPIO));
    $Sensor = stripcslashes(utf8_encode($Sensor));

    $arr[] = array('TSensor_ID' => $TSensor_ID, 'TSensor_Name' => $TSensor_Name, 'GPIO' => $GPIO, 'Sensor' => $Sensor);
  }
  mysqli_close($con);
  echo json_encode($arr);
}

function addTempHumData($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database, $Device)
{
  $TSensor_ID = $_GET['TSensor_ID'];
  $Temperature = $_GET['Temperature'];
  $Humidity = $_GET['Humidity'];

  if ((!empty($TSensor_ID)) && (!empty($Temperature)) && (!empty($Humidity))){
    $con = mysqli_connect($MySQL_IP, $MySQL_Username, $MySQL_Password, $MySQL_Database);

    $sql = "SELECT TSensor_ID FROM tempSensors WHERE Device_ID = $Device";
    $result = mysqli_query($con, $sql) or die (mysqli_error());
    $Permission = False;
    while($row = mysqli_fetch_array($result))
    {
      $TSID = $row['TSensor_ID'];
      if($TSID == $TSensor_ID && $Permission == False){
        $Permission = True;
      }
    }
    if($Permission == True){
      $sql = "INSERT INTO tempHistory (TSensor_ID, Temperature, Humidity) VALUES ($TSensor_ID, $Temperature, $Humidity)";
      $result = mysqli_query($con, $sql) or die (mysqli_error());
      echo("OK");

    }
    else{
      echo("Error no permission");
    }

    mysqli_close($con);
  }
}


?>
