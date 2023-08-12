<?php

session_start();

include "vendor/autoload.php";

use Src\Routes\Routes;      
    
(new Routes())->run($_SERVER['REQUEST_URI']);

?>