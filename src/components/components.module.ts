import { NgModule } from '@angular/core';
import { SchedulePopoverComponent } from './schedule-popover/schedule-popover';
import { ScheduleCreateNewMessageComponent } from './schedule-create-new-message/schedule-create-new-message';
import { SettingsPopoverComponent } from './settings-popover/settings-popover';
import { ScheduleListComponent } from './schedule-list/schedule-list';
import { ScheduleEditMessageComponent } from './schedule-edit-message/schedule-edit-message';
@NgModule({
	declarations: [SchedulePopoverComponent,
    ScheduleCreateNewMessageComponent,
    SettingsPopoverComponent,
    ScheduleListComponent,
    ScheduleEditMessageComponent],
	imports: [],
	exports: [SchedulePopoverComponent,
    ScheduleCreateNewMessageComponent,
    SettingsPopoverComponent,
    ScheduleListComponent,
    ScheduleEditMessageComponent]
})
export class ComponentsModule {}
