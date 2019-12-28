<?php
require_once("DatabaseConnection.php");

class Climate
{
    private $databaseConnection;

    const TEMPERATURE = 'Temperature';
    const HUMIDITY = 'Humidity';
    const SENSOR_NAME = 'SensorName';

    public function __construct()
    {
        $this->databaseConnection = new DatabaseConnection();
    }

    public function getSensorNames()
    {
        $con = $this->databaseConnection->connectDatabase();
        $sql = "SELECT DISTINCT SensorName FROM climateData ORDER BY SensorName DESC";

        $result = mysqli_query($con, $sql) or die (mysqli_error($con));

        if(mysqli_num_rows($result)==0)
            return array();

        while ($row = mysqli_fetch_array($result)) {
            $SensorName = $row[self::SENSOR_NAME];

            $SensorName = stripcslashes(utf8_encode($SensorName));

            $arr[] = array(self::SENSOR_NAME => $SensorName);

        }
        return $arr;
    }

    public function resetClimateData()
    {
        $sensorId = $_GET['sensorId'];
        $climateData['climateDataNow'] = $this->getClimateDataNow();
        $climateData['climateDataDay'] = $this->getClimateDataDay($sensorId);

        echo json_encode($climateData);
    }

    public function initClimateData()
    {
        $climateData['sensorDataArr'] = $this->getSensorNames();
        $climateData['climateDataNow'] = $this->getClimateDataNow();
        $climateData['climateDataDay'] = $this->getClimateDataDay($climateData['sensorDataArr'][0][self::SENSOR_NAME]);

        echo json_encode($climateData);
    }

    public function getClimateDataNow()
    {
        $con = $this->databaseConnection->connectDatabase();

        $sql = "SELECT SensorName, Humidity, Temperature FROM climateData WHERE ID IN ( SELECT MAX(ID) FROM climateData GROUP BY SensorName )";

        $result = mysqli_query($con, $sql) or die (mysqli_error($con));

        if(mysqli_num_rows($result)==0)
            return array();

        while ($row = mysqli_fetch_array($result)) {
            $SensorName = $row[self::SENSOR_NAME];
            $Temperature = $row[self::TEMPERATURE];
            $Humidity = $row[self::HUMIDITY];

            $SensorName = stripcslashes(utf8_encode($SensorName));
            $Temperature = stripcslashes(utf8_encode($Temperature));
            $Humidity = stripcslashes(utf8_encode($Humidity));


            $arr[] = array(self::SENSOR_NAME => $SensorName, self::TEMPERATURE => $Temperature, self::HUMIDITY => $Humidity);
        }
        return $arr;
    }

    public function getClimateDataDay($SensorName)
    {
        $con = $this->databaseConnection->connectDatabase();

        $sql = "SELECT (SELECT HOUR(Timestamp) WHERE MINUTE(Timestamp) < 10) as Hour, Temperature, Humidity FROM climateData WHERE SensorName='$SensorName' AND Timestamp >= now()-INTERVAL 1 DAY ORDER BY Timestamp";

        $result = mysqli_query($con, $sql) or die (mysqli_error($con));

        if(mysqli_num_rows($result)==0)
            return array();

        while ($row = mysqli_fetch_array($result)) {

            $Hour = $row['Hour'];
            $Temperature = $row[self::TEMPERATURE];
            $Humidity = $row[self::HUMIDITY];

            $Hour = stripcslashes(utf8_encode($Hour));
            $Temperature = stripcslashes(utf8_encode($Temperature));
            $Humidity = stripcslashes(utf8_encode($Humidity));

            $arr[] = array('Hour' => $Hour, self::TEMPERATURE => $Temperature, self::HUMIDITY => $Humidity);
        }
        return $arr;
    }

    public function insertClimateDataIntoDB()
    {
        $SensorName = $_GET[self::SENSOR_NAME];
        $Temperature = $_GET[self::TEMPERATURE];
        $Humidity = $_GET[self::HUMIDITY];

        if ((!empty($SensorName)) && (!empty($Temperature)) && (!empty($Humidity))) {
            $con = $this->databaseConnection->connectDatabase();

            $sql = "INSERT INTO climateData (SensorName, Temperature, Humidity) VALUES ('$SensorName', $Temperature, $Humidity)";
            mysqli_query($con, $sql) or die (mysqli_error($con));
        }
    }
}
?>
