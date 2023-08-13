<?php

namespace Src\Controllers {

    use Src\Models\AuthModel;
    use Src\Models\BankModel;

    class BankController
    {
        private $head;
        private $nav;
        private $footer;

        /**
         * Construtor do controller
         */
        public function __construct()
        {
            $this->head = ViewController::render('Includes/Head');
            $this->nav = ViewController::render('Includes/Nav');
            $this->footer = ViewController::render('Includes/Footer');
        }

        /**
         * Função responsável por exibir as infomações para o usuário
         */
        public function renderHome(): void
        {
            // Caso o usuário não esteja logado
            if (!isset($_SESSION['user_name']))
                header('Location: login');

            print ViewController::render('HomeView', [
                'head'         => $this->head,
                'nav'          => $this->nav,
                'footer'       => $this->footer,
                'user_id'      => $_SESSION['user_id'],
                'user_name'    => $_SESSION['user_name'],
                'user_balance' => BankModel::getUserBalance($_SESSION['user_id']),
            ]);           
        }


        /**
         * Função responsável por exibir a tela de login para o usuário
         */
        public function renderLogin(): void
        {         
            // Caso o usuário esteja logado
            if (isset($_SESSION['user_name']))
                header('Location: home');

            print ViewController::render('LoginView', [
                'head'   => $this->head,
                'nav'    => $this->nav,
                'footer' => $this->footer,
            ]);        
        }

        /**
         * Função responsável por realizar a autenticação do usuário
         */
        public function authentication(): void
        {
            if (isset($_POST['logout']))
            {
                session_destroy();

                print json_encode([
                    'statusLogin' => false
                ]);
            }
            else
            {
                $result = (new AuthModel)->searchUser($_POST['account_number'], $_POST['account_pass']);

                if (is_array($result))
                {
                    $_SESSION['user_id'] = $result['user_id'];
                    $_SESSION['user_name'] = $result['user_name'];
    
                    print json_encode([
                        'statusLogin' => true
                    ]);
                }
                else 
                {
                    print json_encode([
                        'statusLogin' => false,
                        'returnLogin' => $result,
                    ]);
                }
            }            
        }

        
        /**
         * Função responsável por realizar a autenticação do usuário
         */
        public function operations($op): void
        {
            switch($op)
            {
                case 'deposit':   
                    $deposit = BankModel::setUserBalance($_POST['user_id'], $_POST['amount'], '+');

                    if ($deposit)
                        BankModel::setLog($_POST['user_id'], 'deposit', 'Deposit of ' . $_POST['amount'] . ',00' );                         

                    print json_encode([
                        'statusDeposit' => $deposit
                    ]);                       
                    break;                    

                case 'withdraw':      
                    $withdraw = BankModel::processUserWithdraw($_POST['user_id'], $_POST['amount']);
                    
                    if ($withdraw['status'])
                        BankModel::setLog($_POST['user_id'], 'withdraw', 'Withdraw of ' . $_POST['amount'] . ',00' );                         

                    print json_encode([
                        'statusWithdraw' => $withdraw['status'],
                        'returnWithdraw' => $withdraw
                    ]);    
                    break;

                case 'getlog':
                    $log = BankModel::getLog($_POST['user_id']);
                                  
                    print json_encode([                        
                        'returnLog' => $log
                    ]);                      
                    break;
            }
        }

    }
}
