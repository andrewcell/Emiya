export const emiyaJ = 'https://emiyaj.vxz.me'

export const url = (api: string, ...parameter: string[]): string => {
    let apiUrl = api;
    parameter.map(value => {
        apiUrl += `/${value}`;
    })
    return apiUrl;
}