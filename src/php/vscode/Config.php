<?php
namespace vscode;

use think\console\Command;
use think\console\Input;
use think\console\input\Argument;
use think\console\Output;
use think\VscodeMessage;

class Config extends Command
{
    protected function configure()
    {
        $this->setName('vscode:config')
            ->addArgument('name', Argument::OPTIONAL, "The name of the configure.")
            ->setDescription('Get the configure from thinkPHP environment.');
    }

    protected function execute(Input $input, Output $output)
    {
        $output->write((string) (new VscodeMessage(config($input->getArgument('name')))));
    }
}
