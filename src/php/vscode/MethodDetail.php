<?php
namespace vscode;

use think\console\Command;
use think\console\Input;
use think\console\input\Argument;
use think\console\Output;
use think\VscodeMessage;

class MethodDetail extends Command
{
    protected function configure()
    {
        $this->setName('vscode:method-detail')
            ->addArgument('name', Argument::REQUIRED, "The name of the class.")
            ->setDescription('Get all the methods\' details in a class.');
    }

    protected function execute(Input $input, Output $output)
    {
        $class         = new \ReflectionClass($input->getArgument('name'));
        $methods       = $class->getMethods(\ReflectionMethod::IS_PUBLIC);
        $extendMethods = $class->getParentClass()->getMethods(\ReflectionMethod::IS_PUBLIC);
        $traitMethods  = [];
        $traits        = $class->getTraits();
        foreach ($traits as $trait) {
            $traitMethods = array_merge($traitMethods, $trait->getMethods(\ReflectionMethod::IS_PUBLIC));
        }
        $details = [];
        foreach ($methods as $method) {
            foreach ($extendMethods as $extendMethod) {
                if ($extendMethod->name === $method->name) {
                    continue 2;
                }
            }
            foreach ($traitMethods as $traitMethod) {
                if ($traitMethod->name === $method->name) {
                    continue 2;
                }
            }
            $details[] = [
                'class'     => $method->class,
                'name'      => $method->name,
                'startLine' => $method->getStartLine(),
                'endLine'   => $method->getEndLine(),
            ];
        }
        $output->write((string) new VscodeMessage($details));
    }
}
