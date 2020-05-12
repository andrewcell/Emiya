export class Mail {
    private static host = 'emiya.vxz.me';
    public static generateVerifyEmail(email: string, verifyHash: string, locString: string): string {
        return `<h5><a href="https://${(Mail.host)}/admin/verify/${verifyHash}">${locString}</a></h5>`
    }
}