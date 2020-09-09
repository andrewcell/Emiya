/**
 * @packageDocumentation
 * @hidden
 */

export class Mail {
    private static host = 'dodo.ij.rs';
    public static generateVerifyEmail(email: string, verifyHash: string, locString: string, username: string): string {
        return `<h5>${username}, <a href="https://${(Mail.host)}/admin/verify/${verifyHash}">${locString}</a></h5>`
    }

    public static generateResetPassword(email: string, verifyHash: string, locString: string): string {
        return `<h5><a href="https://${(Mail.host)}/admin/help/resetpassword/${verifyHash}">${locString}</a></h5>`
    }
}