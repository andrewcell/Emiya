import sql from 'mssql';

class MicrosoftSQL {
    private static instance: MicrosoftSQL;

    private constructor() {

    }

    public static getInstance(): MicrosoftSQL {
        if (this.instance == null) {
            this.instance = new MicrosoftSQL()
        }
        return this.instance;
    }


}
