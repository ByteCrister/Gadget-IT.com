export const DisplayBangladeshTime = (utcDate) => {
    const bangladeshOffset = 6 * 60;
    const localTime = new Date(utcDate).getTime();
    const bangladeshTime = new Date(localTime + bangladeshOffset * 60 * 1000);
    return bangladeshTime.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
};