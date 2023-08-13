<?php 

namespace Src\Models {

    use Exception;
    use Src\Core\DataBase;

    class BankModel
    {
        /**
         * Responsável por consultar o saldo do usuário
         * 
         * @param $user_id  
         * 
         * @return mixed
         */
        public static function getUserBalance(int $user_id, string $type = 'formatted'): mixed
        {   
            try 
            {   
                $getBalance = (new DataBase)->connect()->prepare('SELECT user_balance FROM balance WHERE fk_user_id = ?');
                $getBalance->bindParam(1, $user_id, \PDO::PARAM_INT);                  
    
                if ($getBalance->execute() && $getBalance->rowCount())
                    $amount = $getBalance->fetch(\PDO::FETCH_ASSOC)['user_balance'];

                    if ($type == 'unformatted')
                        return $amount;                                             
                    return 'R$ ' . $amount . ',00';                                             
                
                throw new Exception(); // Caso não conseguir recuperar o saldo do usuário gera uma exceção                                   
            }
            catch (Exception)
            {                                
                return 'Failed to recover balance';
            }            
        }

        /**
         * Responsável por atualizar o saldo do usuário
         * 
         * @param $user_id  
         * @param $amount  
         * 
         * @return bool
         */
        public static function setUserBalance(int $user_id, float $amount, string $operator): bool
        {   
            try 
            {   
                switch($operator)
                {
                    case '+': 
                        $newValue = BankModel::getUserBalance($user_id, 'unformatted') + $amount; 
                        break;
                    case '-':
                        $newValue = BankModel::getUserBalance($user_id, 'unformatted') - $amount; 
                        if ($newValue < 0)
                            throw new Exception();
                        break;
                }                

                $upBalance = (new DataBase)->connect()->prepare('UPDATE balance SET user_balance = ? WHERE fk_user_id = ?');
                $upBalance->bindParam(1, $newValue, \PDO::PARAM_INT); 
                $upBalance->bindParam(2, $user_id, \PDO::PARAM_INT);                  
    
                if ($upBalance->execute())
                    return true;                                             
                
                throw new Exception(); // Caso não conseguir atualizar o saldo do usuário gera uma exceção                                   
            }
            catch (Exception)
            {                                
                return false;
            }            
        }

        /**
         * Responsável por realizar o saque do usuário
         * 
         * @param $user_id  
         * @param $amount  
         * 
         * @return mixed
         */
        public static function processUserWithdraw(int $user_id, string $amount): mixed
        {   
            $cedula100 = 0;
            $cedula50 = 0;
            $cedula20 = 0;
            $cedula10 = 0;
            $cedula5 = 0;
            $cedula2 = 0;
            $cedula1 = 0;

            try 
            {                                   
                $amountSplit = array_reverse(str_split($amount));

                // Tratando as unidades, 1 à 9
                switch($amountSplit[0])
                {
                    case 1: $cedula1 = 1; break;
                    case 2: $cedula2 = 1; break;
                    case 3: $cedula1 = 1; $cedula2 = 1; break;
                    case 4: $cedula2 = 2; break;
                    case 5: $cedula5 = 1; break;
                    case 6: $cedula1 = 1; $cedula5 = 1; break;
                    case 7: $cedula2 = 1; $cedula5 = 1; break;
                    case 8: $cedula1 = 1; $cedula2 = 1; $cedula5 = 1; break;    
                    case 9: $cedula2 = 2; $cedula5 = 1; break;       
                }
                    
                // Tratando as dezenas, 10 à 99
                if ($amount >= 10)
                {
                    switch($amountSplit[1])
                    {
                        case 1: $cedula10 = 1; break;
                        case 2: $cedula20 = 1; break;
                        case 3: $cedula10 = 1; $cedula20 = 1; break;
                        case 4: $cedula20 = 2; break;
                        case 5: $cedula50 = 1; break;
                        case 6: $cedula10 = 1; $cedula50 = 1; break;
                        case 7: $cedula20 = 1; $cedula50 = 1; break;
                        case 8: $cedula10 = 1; $cedula20 = 1; $cedula50 = 1; break;    
                        case 9: $cedula20 = 2; $cedula50 = 1; break;       
                    }
                }

                // Tratando as centenas, 100 à ...
                if ($amount >= 100)
                {
                    if ($amount < 1000)
                    {                    
                        $cedula100 = $amountSplit[2];
                    }
                    else         
                    {
                        foreach(array_reverse($amountSplit) as $index => $val)
                        {      
                            if ($index < count($amountSplit) - 2)
                                $cedula100 .= $val;
                        }    
                        $cedula100 = substr($cedula100, 1);
                    }
                }
                
                // Após calcular, remove o valor da conta
                if (BankModel::setUserBalance($user_id, $amount, '-'))
                {
                    return [
                        'status' => true,
                        'cedula100' => $cedula100,
                        'cedula50' => $cedula50,
                        'cedula20' => $cedula20,
                        'cedula10' => $cedula10,
                        'cedula5' => $cedula5,
                        'cedula2' => $cedula2,
                        'cedula1' => $cedula1,
                    ];       
                }         
                
                throw new Exception(); // Caso não seje possível efetuar o saque, gera uma exceção
            }
            catch (Exception $e)
            {                                
                // return $e->getMessage(); // for debug
                return [ 'status' => false ];
            }            
        }

        /**
         * Responsável por gerar log das transações do usuário
         * 
         * @param $user_id  
         * @param $action  
         * @param $description  
         * 
         * @return bool
         */
        public static function setLog(int $user_id, string $action, string $description): bool
        {   
            try 
            {                             
                $log = (new DataBase)->connect()->prepare('INSERT INTO log (fk_user_id, log_action, log_description, log_date_insert) VALUES (?, ?, ?, NOW())');
                $log->bindParam(1, $user_id, \PDO::PARAM_INT); 
                $log->bindParam(2, $action, \PDO::PARAM_STR);  
                $log->bindParam(3, $description, \PDO::PARAM_STR);                  
    
                if ($log->execute())
                    return true;                                             
                
                throw new Exception(); // Caso não conseguir atualizar o saldo do usuário gera uma exceção                                   
            }
            catch (Exception)
            {                                
                return false;
            }            
        }

        /**
         * Responsável por resgatar os logs do usuário
         * 
         * @param $user_id           
         * 
         * @return bool
         */
        public static function getLog(int $user_id): string
        {   
            try 
            {                             
                $html = '';
                $log = (new DataBase)->connect()->prepare('SELECT * FROM log WHERE fk_user_id = ?');
                $log->bindParam(1, $user_id, \PDO::PARAM_INT);                           
    
                if ($log->execute() && $log->rowCount())                   
                    while($l = $log->fetch(\PDO::FETCH_ASSOC))                                  
                    {
                        $html .= '<tr>                                     
                                     <td>' . $l['log_description'] . '</td>
                                     <td>' . date('d/m/Y h:m:s', strtotime($l['log_date_insert'])) . '</td>    
                                 </tr>';
                    }
                    return $html;
                
                throw new Exception(); // Caso não coletar nenhum log, gera uma exceção                                   
            }
            catch (Exception)
            {                                
                return 'No logs to display';
            }            
        }
    }
}
