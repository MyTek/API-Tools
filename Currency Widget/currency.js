$j(function(){
var devnotes = document.getElementById('ticket_fields_462252');
var sqldata = "INSERT INTO currencies (currency_name, currency_abbr, currency_symbol)\n\n";
var abbtog = 0;
var ratetog = 0;
var indexplus = 1;
var index2 = 0;
var ratesgood = 1;
submitcurrency = function(){
var comments = document.getElementById('comment_value');
if(!comments.value){comments.value += "These are the exchange rates being input:\n";}else{comments.value += "\nThese are the exchange rates being input:\n";};
if(devnotes.value){devnotes.value = devnotes.value + "\n\n";};
var list = new Array();
//$j('#results tbody').empty().find('tbody');
	for(var plus = 0;plus<=indexplus;plus++){
		list[plus] = $j('#add'+plus).val();
		if(!abbtog){
			sqldata += "SELECT '', '" + $j('#add'+(plus+1)).val() + "', ''\n";
			abbtog = 1;
		} else if($j('#add'+(plus+1)).val()){
			sqldata += "UNION ALL SELECT '', '" + $j('#add'+(plus+1)).val() + "', ''\n";
		}
	};
sqldata += "\nINSERT INTO currency_exchange_rates (base_currency_id, quote_currency_id, start_date, end_date, rate)\n\n";
var repeat = 0;
var count = 0;
for(var row = 0;row<indexplus;row++){
	for(var plus = 0;plus<=repeat;plus++){
		var from = list[plus];
		var to = list[count+1];
		if(from && to){
			var firstrate;
			var secondrate;
			var checkrate;
			$j.ajax({
				type: 'GET',
				url: "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+from+to+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json",
				dataType: 'json',
				async: false,
				success: function (data) {
				firstrate = data.query.results.row.rate;
				}
			});
			$j.ajax({
				type: 'GET',
				url: "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+to+from+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json",
				dataType: 'json',
				async: false,
				success: function (data) {
				secondrate = data.query.results.row.rate;
				}
			});
			//Check for rates that are null
			if(!(firstrate>0) && secondrate>0){
				firstrate = 1/secondrate;
				checkrate = from;
			}
			if(!(secondrate>0) && firstrate>0){
				secondrate = 1/firstrate;
				checkrate = to;
			}
			if(!(firstrate>0) && !(secondrate>0)){
				alert("Check rates for " + from + " and " + to);
			}
			if(!ratetog){
				sqldata += "SELECT base_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + from + "'), quote_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + to + "'), start_date = '#START_DATE#', end_date = '#END_DATE#', rate = " + firstrate + "\n";
				ratetog = 1;
				comments.value += "From " + from + " to " + to + "=" + firstrate + "\n";
			} else{
				sqldata += "UNION ALL SELECT base_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + from + "'), quote_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + to + "'), [start_date] = '#START_DATE#' , end_date = '#END_DATE#' , rate = " + firstrate + "\n";
				comments.value += "From " + from + " to " + to + "=" + firstrate + "\n";
			}
			sqldata += "UNION ALL SELECT base_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + to + "'), quote_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + from + "'), [start_date] = '#START_DATE#' , end_date = '#END_DATE#' , rate = " + secondrate + "\n";
					comments.value += "From " + to + " to " + from + "=" + secondrate + "\n";
			
		};
		if(repeat<count){
			repeat++;
		}else{
			repeat=0;count++;
		}
	};
};
	
var repeat = 0;
var count = 0;
	
for(var existing = 0;$j('#existing'+existing).val();existing++){
	for(var plus = 0;list[plus+1];plus++){
		var from = $j('#existing'+existing).val();
		var to = list[plus+1];
		if(from && to){
			var firstrate;
			var secondrate;
			var checkrate;
		$j.ajax({
				type: 'GET',
				url: "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+from+to+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json",
				dataType: 'json',
				async: false,
				success: function (data) {
				firstrate = data.query.results.row.rate;
				}
		});
		$j.ajax({
				type: 'GET',
				url: "http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D"+to+from+"%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json",
				dataType: 'json',
				async: false,
				success: function (data) {
				secondrate = data.query.results.row.rate;
				}
		});
		
					//Check for rates that are null
			if(!(firstrate>0) && secondrate>0){
				firstrate = 1/secondrate;
				checkrate = from;
			}
			if(!(secondrate>0) && firstrate>0){
				secondrate = 1/firstrate;
				checkrate = to;
			}
			if(!(firstrate>0) && !(secondrate>0)){
				alert("Check rates for " + from + " and " + to);
			}
			sqldata += "UNION ALL SELECT base_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + from + "'), quote_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + to + "'), [start_date] = '#START_DATE#' , end_date = '#END_DATE#' , rate = " + firstrate + "\n";
			comments.value += "From " + from + " to " + to + "=" + firstrate + "\n";
			
			sqldata += "UNION ALL SELECT base_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + to + "'), quote_currency_ID = (SELECT currency_id from currencies where currency_abbr = '" + from + "'), [start_date] = '#START_DATE#' , end_date = '#END_DATE#' , rate = " + secondrate + "\n";
			comments.value += "From " + to + " to " + from + "=" + secondrate + "\n";
		
		
		};
	};
};
//if(ratesgood == 1){
	devnotes.value += sqldata + "\n" + "ORDER BY base_currency_id, quote_currency_id" + "\n\n";
	alert("Done.  Check dev notes for values.  If you encountered errors please fix them manually.");
//};
ratesgood = 1;
sqldata = "INSERT INTO currencies ( currency_name, currency_abbr, currency_symbol)\n\n";
abbtog = 0;
ratetog = 0;
};

plusexisting = function(){
$j('#Existing').append('<div style="width:50%;" id="existingdiv'+index2+'"><input type="text" id="existing'+index2+'" style="width:40%;"/><span>Existing</span></div>');
index2++;
};
minusexisting = function(){
if(index2){
index2--;
$j('#existingdiv'+index2).remove();
}
};

plus = function(){
indexplus++;
$j('#Add').append('<div style="width:50%;" id="adddiv'+indexplus+'"><input type="text" id="add'+indexplus+'" style="width:40%;"/><span>Add</span></div>');
};
minus = function(){
if(indexplus>1){
$j('#adddiv'+indexplus).remove();
indexplus--;
};
};
});