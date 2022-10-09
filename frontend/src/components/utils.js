export const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
};

export const birthdayFormat = (value) => {
    const date = value;
    const month = date.split('-')[1]
    const day = date.split('-')[2]

    let dayRes = ''
    let monthRes = '';

    if (month === '01') { monthRes = "Janvier" }
    if (month === '02') { monthRes = "Fevrier" }
    if (month === '03') { monthRes = "Mars" }
    if (month === '04') { monthRes = "Avril" }
    if (month === '05') { monthRes = "Mai" }
    if (month === '06') { monthRes = "Juin" }
    if (month === '07') { monthRes = "Juillet" }
    if (month === '08') { monthRes = "Aout" }
    if (month === '09') { monthRes = "Septembre" }
    if (month === '10') { monthRes = "Octobre" }
    if (month === '11') { monthRes = "Novembre" }
    if (month === '12') { monthRes = "Decembre" }

    

    if (day.match('0')) { dayRes = day.slice(1) }
    else { dayRes = day }

    return dayRes +" "+ monthRes;
}

export const dateFormat = (value) => {
    const time = ((new Date()) - (new Date(value)));

    const oneYear = 1000 * 60 * 60 * 24 * 365
    const oneMonth = 1000 * 60 * 60 * 24 * 30
    const oneDay = 1000 * 60 * 60 * 24


    function newFormat (time, scale) {
        return String(time / scale).split('.')[0]
    }

    if (time >= oneYear) {
        return newFormat(time, oneYear) + " ans";
    }
    if (time >= oneMonth) {
        return newFormat(time, oneMonth) + " mois";
    }
    if (time >= oneDay) {
        return newFormat(time, oneDay) + " jours";
    }
    if (time < (oneDay * 2)) {
        return "Hier";
    }
    if (time < oneDay) {
        return "Aujourd'hui";
    }
}

export const postTime = (value) => {
    const date = dateFormat(value)

    let part =  null
    if ((date === "Aujourd'hui" )|| (date === "Hier" )) {
      part = ''
    } else {
      part = "Il y a "
    }
    return part + date
  }