import { expect, test } from '@jest/globals';
import 'reflect-metadata';
import { CommandApplication } from '../src/application';
import { arg, cli, Command } from '../src/command';
import { createModule } from '../src/module';
import { ServiceContainer } from '../src/service-container';

@cli.controller('my')
class MyCli implements Command {
    async execute(
        @arg host: string
    ) {
        return host;
    }
}

test('command simple', () => {
    const cliConfig = cli._fetch(MyCli);
    if (!cliConfig) throw new Error('cliConfig expected');

    expect(cliConfig.name).toBe('my');
    expect(cliConfig.args.host.name).toBe('host');
    expect(cliConfig.args.host.optional).toBe(false);
    expect(cliConfig.args.host.propertySchema!.type).toBe('string');
});

test('command execute', async () => {
    const MyModule = createModule({
        controllers: [MyCli]
    });

    const app = new CommandApplication(MyModule);
    const serviceContainer = app.get(ServiceContainer);
    expect(serviceContainer.cliControllers.controllers.get('my')).toBe(MyCli);

    expect(await app.execute(['my', 'bar'])).toBe('bar');
});