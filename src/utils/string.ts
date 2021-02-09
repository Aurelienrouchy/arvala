export const queryToObject = (queryString: string): any => {
    const pairsString = queryString[0] === '?' ? queryString.slice(1) : queryString
    const pairs = pairsString
        .split('&')
        .map(str => str.split('=').map(decodeURIComponent))
    return pairs.reduce((acc, [key, value]) => key ? { ...acc, [key]: value } : acc, {})
}

export const capitalize = (str: string) => typeof str === 'string' && str.charAt(0).toUpperCase() + lowercase(str.slice(1));

export const capitalizeIfBold = (str: string) => typeof str === 'string' && str.charAt(0) === '<' ? `<b>${capitalize(str.slice(3))}` : capitalize(str);

export const lowercase = (str: string) => typeof str === 'string' && str.toLocaleLowerCase();

export const boldString = (str: string, substr: string) => substr.length > 0 ? str.replaceAll(substr, `<b>${substr}</b>`) : str;
