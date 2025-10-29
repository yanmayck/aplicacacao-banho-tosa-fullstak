import { Module } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { PluginsController } from './plugins.controller';
import { PluginRegistry } from './plugin-registry.service';
import { PluginLoader } from './plugin-loader.service';
import { HookService } from './hook.service';
import { PluginSecurityService } from './plugin-security.service';

@Module({
  controllers: [PluginsController],
  providers: [
    PluginsService,
    PluginRegistry,
    PluginLoader,
    HookService,
    PluginSecurityService,
  ],
  exports: [PluginsService, PluginRegistry, HookService, PluginSecurityService],
})
export class PluginsModule {}
