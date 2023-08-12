<?php

namespace Src\Controllers {

    class BankController
    {

        /**
         * Função responsável por exibir as infomações para o usuário
         */
        public function renderHome(): void
        {
            // Caso o usuário não esteja logado
            if (!isset($_SESSION['cli_name']))
                header('Location: login');

            print ViewController::render('HomeView', [
                
            ]);           
        }


        /**
         * Função responsável por exibir as infomações para o usuário
         */
        public function renderLogin(): void
        {         
            // Caso o usuário esteja logado
            if (isset($_SESSION['cli_name']))
                header('Location: home');

            print ViewController::render('LoginView');        
        }

    }
}
