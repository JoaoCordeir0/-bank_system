<?php 

namespace Src\Models {

    use Exception;
    use Src\Core\DataBase;

    class AuthModel
    {
        /**
         * Responsável por consultar se as credenciais informadas existem no banco de dados
         * 
         * @param $acc_number 
         * @param #pass
         * 
         * @return mixed
         */
        public function searchUser(string $acc_number, string $pass): mixed
        {   
            try 
            {   
                $userInfo = [];

                $search = (new DataBase)->connect()->prepare('SELECT * FROM users WHERE user_account_number = ?');
                $search->bindParam(1, $acc_number, \PDO::PARAM_STR);                  
    
                if ($search->execute())

                    $userInfo = $search->fetch(\PDO::FETCH_ASSOC);                         

                    if ($search->rowCount() && password_verify($pass, $userInfo['user_password']))
                        return $userInfo;
                return 'User not found';                                   
            }
            catch (Exception $e)
            {                
                //return $e->getMessage(); // for debug                
                return 'Failed to process';
            }            
        }
    }
}
