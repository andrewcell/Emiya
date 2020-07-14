export const emiyaJ = 'https://emiyaj.vxz.me'
// export const emiyaJ = 'http://127.0.0.1:8080'
export const url = (api: string, ...parameter: string[]): string => {
    let apiUrl = api;
    parameter.map(value => {
        apiUrl += `/${value}`;
    })q
    return apiUrl;
}
