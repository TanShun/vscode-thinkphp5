<?php
namespace vscode;

use think\console\Command;
use think\console\Input;
use think\console\Output;
use think\facade\App;

class Version extends Command
{
    protected function configure()
    {
        $this->setName('vscode:view-path')
            ->setDescription('Get the version of thinkPHP framework.');
    }

    protected function execute(Input $input, Output $output)
    {
        $output->write(json_encode(['code' => 0, 'message' => 'OK', 'content' => App::version()]));
    }
}
