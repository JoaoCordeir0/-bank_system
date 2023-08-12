<?php

namespace Src\Core 
{   
    use PDO;
    use PDOException;

    final class DataBase{              

        /**
         * Método que conecta com banco de dados
         * 
         * @return mixed
         * 
         */
        public final function connect(): object
        {                        
            try 
            {
                $serverName  = "localhost";
                $dataBase    = "bank_system";
                $uid         = "root";
                $pwd         = "";
                
                $db = new PDO("mysql:host=$serverName;dbname=$dataBase", $uid, $pwd);  

                $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                return $db;
            } 
            catch (PDOException $e) 
            {                            
                print $e->getMessage();
            }                                  
        }   
                
        /**
         * Método que destroi a conexão com banco de dados e remove da memória todas as variáveis setadas
         */
        public function __destruct()
        {        
            foreach ($this as $key => $value) {
                unset($this->$key);
            }
        }
    }
}

?>