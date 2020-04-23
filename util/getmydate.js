module.exports = {

	/////////////////////////////////////// getMyDate  /////////////////////////////////////////
	getMyDate: () => {
		const d = new Date();
		//const nday = d.getDay();
		let nmonth = (d.getMonth() + 1), ndate = d.getDate(), nyear = d.getYear();

		//OPTIONAL to make 2 digits for all MM/DD
		if (ndate <= 9) ndate = '0' + ndate;
		if (nmonth <= 9) nmonth = '0' + nmonth;

		if (nyear < 1000) nyear += 1900;
		let nhour = d.getHours(), nmin = d.getMinutes(), nsec = d.getSeconds(), ap;

		if (nhour === 0) {
			ap = ' AM';
			nhour = 12;
		}
		else if (nhour < 12) {
			ap = ' AM';
		}
		else if (nhour === 12) {
			ap = ' PM';
		}
		else if (nhour > 12) {
			ap = ' PM';
			nhour -= 12;
		}

		//OPTIONAL to make 2 digits for all hh:mm:ss
		if (nhour <= 9) nhour = '0' + nhour;
		if (nmin <= 9) nmin = '0' + nmin;
		if (nsec <= 9) nsec = '0' + nsec;

		const finalDate = nmonth + '-' + ndate + '-' + nyear;
		const finalHour = nhour + '.' + nmin + '.' + nsec + ap;

		return finalDate + ' ' + finalHour;
	}
};