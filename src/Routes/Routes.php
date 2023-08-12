<?php

namespace Src\Routes 
{   
    use Exception;
    use Src\Controllers\BankController;
    use Src\Controllers\ViewController;

    class Routes
    {
        /**
         * Responsável por executar as rotas
         * 
         * @param $requestUri
         */
        public function run(string $requestUri): void
        {
            try
            {
                $route = explode("?", substr($requestUri, 1))[0];
            }
            catch (Exception) 
            {
                $route = substr($requestUri, 1);
            }
                        
            $route === '' ? $this->home() : $this->$route();                   
        }
       

        /**
         * Rota default do sistema, no qual é apresentadas todas as informações ao usuário caso ele esteja logado
         */
        protected function home(): void { (new BankController)->renderHome(); }

        /**
         * Rota de login do sistema
         */
        protected function login(): void { (new BankController)->renderLogin(); }


        /**
         * Tratamento de exceção para páginas que não existem, error 404
         * 
         * @param $name
         * @param $arguments
         */
        public function __call($name, $arguments): void
        {
            http_response_code(404);                      
            print ViewController::render('ExceptionView', ['message' => '404, page not found.']);
        }
    }
}

?>