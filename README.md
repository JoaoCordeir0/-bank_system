## Manual de como rodar o projeto local

> João Victor Cordeiro - 01/08/2023

#

Requisitos:

* PHP 8.1;
* Composer do PHP;
* Exntensões: php_pdo_sqlsrv_81_ts_x64.dll e php_sqlsrv_81_ts_x64.dll;
    * Detalhes sobre as extensões: https://learn.microsoft.com/pt-br/sql/connect/php/microsoft-php-driver-for-sql-server?view=sql-server-ver16
* Inserir nas variáveis de ambiente do Windows o caminho da instalação do PHP;
    * Detalhes sobre as variáveis: https://devcontratado.com/blog/php/como-configurar-um-ambiente-php-mysql

Instalação de pacotes:

* Para instalar as dependências do projeto basta rodar o seguinte comando: *"composer install"* no diretório: *"D:\Projetos\gnpay>"*

Rodar o projeto:

* Para rodar o projeto após instalar as dependências basta rodar o seguinte comando: *"php -S localhost:9090"* no diretório: *"D:\Projetos\gnpay>"*

Como subir o projeto:

* O projeto está hospedado no AWS na máquina "win2012-apps-01" no diretório: *"E:\Home\gnpay"*;
* Para subir basta se conectar remotamente e fazer uma transferência nos arquivos que foram alterados;
* Após subir os arquivos, reinicie o projeto no IIS;

Como renovar o certificado do GnPay:

* O procedimento é bem simples, basta executar a ferramenta: *"wacs.exe"* que está na área de trabalho do apps-01: *"C:\Users\Administrator\Desktop\win-acme-certificate"*
* O procedimento que deve ser feito está descrito em: https://www.win-acme.com/manual/getting-started
* Video complementar: https://www.youtube.com/watch?app=desktop&v=vbk5kUT7GeY&t=89s