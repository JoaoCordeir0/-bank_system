<?php 

namespace Src\Controllers {
    
    class ViewController
    {
        /**
         * Responsável por renderizar as views
         * 
         * @param $view
         * @param #vars
         * 
         * @return mixed
         */
        public static function render(string $view, array $vars = []): string
        {                                    
            $file = './src/Views/' . $view . '.html';      
                    
            $contentView = file_exists($file) ? file_get_contents($file) : '';             

            $keys = array_keys($vars);
            $keys = array_map(function($item){
                return '{{'.$item.'}}';
            }, $keys);

            return str_replace($keys, array_values($vars), $contentView);            
        }
    }
}
