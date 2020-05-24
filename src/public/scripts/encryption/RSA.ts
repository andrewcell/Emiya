import crypto from 'crypto';
import constants from 'constants';

const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEowIBAAKCAQEAyITNW1Qjq3UUWsQ9GSwGnur3wLe0CXGMQCR7dOwj0CnlfZnz\n' +
    'ZOfcz49i6jl6H1VJr09M52hFTDE8+F2TlYCvVEsVTFlxars9F5BIGTdmRKwakTk2\n' +
    'yD1RPFHizOpo0IsTfefMgJjXBobwoRQ/lEP95X0LfROdym43jwVRMnOvk4XN78T8\n' +
    'SKvEOOaBc1dvrqjucVn94H7q9QYWNLYi9VjRicuumPbuzCwXmIV2+2QPDi7nyoFm\n' +
    'XSqiY441Q+/92JGUrfBnCokdEpNbnG/Pu/gbjkk6F6akQMc6SyUse2u1oLcvRuEJ\n' +
    'i0bcBiWNB9V8hauaqMamszC8aQYbaoPJC60fawIDAQABAoIBAACU0fuXzNqsZji1\n' +
    'JPAzvnkreThnz+/PEncFJA58uMXbuTyZ+6ipO2ymn8TKEd6RYrtNYY2yMbE8205l\n' +
    'Bw6B5wA5j4A/KiMDE/RDiNH55SQB07nkDpKaCug/3IZ3j4I7RP0ydNdSmhz8uync\n' +
    'YyrM36mQqT3dlrGFjEev3kJlL3cgBN5M1ZkD5Nya8Pn8Mlt0rA/qAEpVWCmZHvxa\n' +
    'vmm3LQurW64qM2M73J57Y75KZu4bJjiN7GWaHMMo9cUcCy6IGDdVgVcayWfkzakt\n' +
    'qCGuR0C0rdz+zXzp9KBJ6OmDkWeQ8R+QrrrkyH3MXgVGor6Nk02EtkVrK6M9keiU\n' +
    '98i3ZLECgYEA6siLiKDbB5agsTQ/Fv7D+KFW6gpfuCuztOuycbEevtQGU4pA/A+u\n' +
    'OfhScSp8y91yU5ukTd38aSRc7MwvPpFZScyVRnoqxAJXW5WhCkClmTVCdsvOGHHf\n' +
    'OhK6TYoo8+Fh1bR8QivDLl2lE/vOyfh0JcvCGqXh3cehmkOevy5E+mcCgYEA2qOV\n' +
    'NeEW9z7VMrQVMLv7KurfxT0DlTjFd4y/Sj9kKdLefAl7RFcaW9CxXyxUGhWuqiPj\n' +
    '5e+sYqX3cMuKdb7DaUrTe1z/WCWCqdHVFzdmzytOwQpGYRMGQ0J5a9hcd3Yb1Ni3\n' +
    '6vnFLjjcVn8D+bU09LypNaT3NwDGqV5No+PnmF0CgYBMdsP622h6MDRlgf6KHq70\n' +
    'apdD4d0KvjDo21pibKz2uVbWHlDLxs+XUaiH8q5yNszlLet08LckBxO8i0NXvT63\n' +
    'KknzihYjgB+zVCf+js9f9liPGBEnJO7umurSFg0AYIbccsuFQXtvvk/lEj1myeQJ\n' +
    '6zJsO1o0QLAA7cTlvsv4QQKBgCFqHsO9QuVGlQ7KtvJbyGcmvkxGpuWHZ6Z9vD58\n' +
    'sbIyqA4M5Ons5fpiSrlg7PmPlsIp+gqKNq5c7xQuB1s3bGYLKYcRD3VJRk7t4sNJ\n' +
    'lEzVMZQPHfJ4Fdzxq9zvlDItutMsy+79fUUzK3mMr+7Z4t4Ed1fbfmzJkZMQ9oy1\n' +
    'qA+BAoGBAOnift/0bJna7Tu5yTdngP3k515YbsCNdFSYqDuxwLJKLKCUfrEhqS7o\n' +
    'H65mIi5Rs2Hi0hROu0OMaUf9VOO3ZkPIAUpI0u1wLegRXpK+dbcGUW/Yhe9kq75S\n' +
    'buGkvtpiTgl6kN5uND4kUO2CA7OETB4PFRmn7i+j9H6kli43Y6Wp\n' +
    '-----END RSA PRIVATE KEY-----';

const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHGqiocg7tzrCjFfM6X\n' +
    'k2iGXHiyF/gt6AnEoLNjMyQzv5zYA16JxZv8kCSnflaEJtkiyF5nE66FefyoWxI6\n' +
    'fNn5snWL+7isFq/J/FAleDA0BTbiP9owsMSiqqs9G1oCXWjBqbx/d/I08VbJR6a7\n' +
    'y5B4G+3hdeXKV9QfytCNeV/gZdxwS1FgMO1T2TaXwJzsejUNNhCB4BeDA3g38prC\n' +
    'PqhxGwx0hycaI/XqRZHmY2IvweW6ZdHXahoWviOclbJllKQMeTJipHaDFH82qGK+\n' +
    '/E0AhY/XLxzTuKPueoUYgFbjtnbri+3UOqP2zUBnpNwHyzwXnTJm7E4D6G0O7piY\n' +
    'fwIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

const getKey = (key: string[]) => {
    return key.join("");
}

export const encrypt = (raw: string): string => {
    return Buffer.from(crypto.publicEncrypt({"key": publicKey, padding: constants.RSA_PKCS1_PADDING}, Buffer.from(raw))).toString('base64')
}

export const decrypt = (base64: string): string => {
    return crypto.privateDecrypt({"key": privateKey, padding:constants.RSA_PKCS1_PADDING}, Buffer.from(base64, 'base64')).toString()}
