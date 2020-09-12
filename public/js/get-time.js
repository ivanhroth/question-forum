async function obtainTime(createdAt) {
    let timeMessage;
    const time = await createdAt
    const todaysDate = new Date();

    const diffInMiliseconds = await Math.abs(todaysDate.getTime() - time.getTime())
    const diffInSeconds = await Math.floor(diffInMiliseconds / 1000)
    const diffInMinutes = await Math.floor(diffInSeconds / 60)
    const diffInHours = await Math.floor(diffInMinutes / 60)
    const diffInDays = await Math.floor(diffInHours / 24)
    const diffInMonths = await Math.floor(diffInDays / 30)
    const diffInYears = await Math.floor(diffInDays / 365)

    if (diffInYears > 0) {
        timeMessage = 'more than a year.';
    } else if (diffInMonths > 0) {
        if (diffInMonths === 1) timeMessage = 'more than a month ago.';
        if (diffInMonths > 1) timeMessage = `more than ${diffInMonths} months ago.`;
    } else if (diffInDays > 0) {
        if (diffInDays === 1) timeMessage = 'more than a day ago.';
        if (diffInDays > 1) timeMessage = `more than ${diffInDays} days ago.`;
    } else if (diffInHours > 0) {
        if (diffInHours === 1) timeMessage = 'more than an hour ago.';
        if (diffInHours > 1) timeMessage = `more than ${diffInHours} hours ago.`;
    } else if (diffInMinutes > 0) {
        if (diffInMinutes === 1) timeMessage = 'more than a minute ago.';
        if (diffInMinutes > 1) timeMessage = `more than ${diffInMinutes} minutes ago.`;
    } else {
        timeMessage = 'less than a minute ago.';
    }
    return timeMessage;
}
module.exports = { obtainTime }
