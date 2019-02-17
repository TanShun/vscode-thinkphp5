<?php
namespace vscode;

use ReflectionClass;
use ReflectionMethod;
use think\console\Command;
use think\console\Input;
use think\console\input\Argument;
use think\console\Output;
use think\facade\App;
use think\facade\Request;
use think\View;
use think\VscodeMessage;

class ViewPath extends Command
{
    protected function configure()
    {
        $this->setName('vscode:view-path')
            ->addArgument('context', Argument::REQUIRED, 'The context witch contains module, controller and action.')
            ->addArgument('name', Argument::OPTIONAL, 'The name of the template.', '')
            ->setDescription('Get the real template file path.');
    }

    protected function execute(Input $input, Output $output)
    {
        $context = explode('/', $input->getArgument('context'));
        App::init($context[0]);
        Request::setModule($context[0])
            ->setController($context[1])
            ->setAction($context[2]);

        $view   = (new View)->init();
        $engine = (new ReflectionClass($view))->getProperty('engine')->getValue($view);
        $method = new ReflectionMethod($engine, 'parseTemplate');
        $method->setAccessible(true);
        $template = $method->invoke($engine, '');
        if (!is_file($template)) {
            throw new \Exception('The file "' . $template . '" is not exgist.');
        }
        $output->write((string) new VscodeMessage($template));
    }
}
