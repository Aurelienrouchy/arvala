export const capitalize = (str) => typeof str === 'string' && str.charAt(0).toUpperCase() + lowercase(str.slice(1));

export const capitalizeIfBold = (str) => typeof str === 'string' && str.charAt(0) === '<' ? `<b>${capitalize(str.slice(3))}` : capitalize(str);

export const lowercase = (str) => typeof str === 'string' && str.toLocaleLowerCase();

export const boldString = (str, substr) => substr.length > 0 ? str.replaceAll(substr, `<b>${substr}</b>`) : str;
