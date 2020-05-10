export class b64 {
    private encoded: string
    constructor(data: string) {
        this.encoded = data
    }

    public decode(): string {
        return atob(this.encoded)
    }
}
