

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const thirtyDaysFromNow = ():Date => 
  new Date(  Date.now() + 30 * 24 * 60 * 60 * 1000);

export const thirtyMinutes = (): Date =>
  new Date(Date.now() + 30 * 60 * 1000);

  export const threeMinutesAgo = (): Date =>
    new Date(Date.now() - 3 * 60 * 1000);

  export const anHourFromNow = (): Date =>
    new Date(Date.now() + 10 * 60 * 1000)




function add(date: Date, duration: { minutes?: number; hours?: number; days?: number }): Date {
  const newDate = new Date(date);
  if (duration.minutes) {
    newDate.setMinutes(newDate.getMinutes() + duration.minutes);
  }
  if (duration.hours) {
    newDate.setHours(newDate.getHours() + duration.hours);
  }
  if (duration.days) {
    newDate.setDate(newDate.getDate() + duration.days);
  }
  return newDate;
}



export const calculateExpiresDate = (expiresIn: string = "15m"): Date => {
  // Match number + unit (m = minutes, h = hours, d = days)
  const match = expiresIn.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error('Invalid format. Use "15m", "1h", or "2d".');
  const value = parseInt(match[1]); // Number part (e.g., 30)
  const unit = match[2];  
  const expirationDate = new Date();

  // Check the unit and apply accordingly
  switch (unit) {
    case "m": // minutes
      return add(expirationDate, { minutes: value });
    case "h": // hours
      return add(expirationDate, { hours: value });
    case "d": // days
      return add(expirationDate, { days: value });
    default:
      throw new Error('Invalid unit. Use "m", "h", or "d".');
  }

}

