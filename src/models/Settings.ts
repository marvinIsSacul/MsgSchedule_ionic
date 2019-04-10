
export interface SmsSettings{
    maxSmsCount: number;
}

export interface SystemSettings{
    shouldShowNotifications: boolean;
    shouldShowMessageSentNotifications: boolean;
    shouldShowMessageFailedNotifications: boolean;
    shouldAutoCheckUpdates: boolean;
}

export interface Settings{
    version: number;

    system: SystemSettings;
    sms: SmsSettings;
}