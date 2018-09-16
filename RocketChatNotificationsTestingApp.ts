import { IDesktopNotificationBuilder, IHttp, ILogger, INotificationBuilder, IPersistence, IRead, INotificationExtender } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    IDesktopNotification,
    INotification,
    IPostNotificationSent,
    IPreDesktopNotificationSentModify,
    IPreNotificationSentModify,
    IPreNotificationSentPrevent,
    IPreNotificationSentExtend,
} from '@rocket.chat/apps-engine/definition/notifications';

export class RocketChatNotificationsTestingApp extends App implements IPreNotificationSentPrevent, IPreNotificationSentExtend, IPreNotificationSentModify, IPreDesktopNotificationSentModify, IPostNotificationSent {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async executePreNotificationSentPrevent(notification: INotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean> {
        return !!notification.message.match(/^BLOCK ME PLS/);
    }

    public async executePreNotificationSentExtend(notification: INotification, extend: INotificationExtender, read: IRead, http: IHttp, persistence: IPersistence): Promise<void> {
        extend.addCustomField('testField', 'alo');
    }

    public async executePreNotificationSentModify(notification: INotification, builder: INotificationBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<INotification> {
        builder.setMessage(`${notification.message} - Testing App Notification`);

        return builder.getNotification();
    }

    public async executePreDesktopNotificationSentModify(notification: IDesktopNotification, builder: IDesktopNotificationBuilder, read: IRead, http: IHttp, persistence: IPersistence): Promise<IDesktopNotification> {
        builder.setTitle(`${notification.title} - Testing App Desktop Notification`);

        return builder.getDesktopNotification();
    }

    public async executePostNotificationSent(notification: INotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<void> {
        // notification.customFields.testField should be inside there
        this.getLogger().debug('POST NOTIFICATION', notification);
    }
}
