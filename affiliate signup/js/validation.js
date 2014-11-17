$(function(){

//var datenow = new Date();

//datenow.format("m/dd/yy");

//$('#date_added').val( getMonth() + '/' + getDate() + '/' + getFullYear() );
//alert( getMonth() + '/' + getDate() + '/' + getFullYear() );

var cakeinstancedomain = 'https://admin.aff.biz';
//var phpfileurl = 'affiliate_signup.php';
var phpfileurl = 'affiliate_signup.php';
var thankyoupage = 'thank_you.php';
//var proxy = phpfileurl;
var signup = encodeURIComponent(cakeinstancedomain + '/api/4/signup.asmx/Affiliate?');
//var login = '//admin.aff.biz/affiliates/login.ashx?tp=1';
var portal = 'https://admin.aff.biz/affiliates/';
    //$(".button").click(function() {

$('#address_state').val("NONE").trigger('change');
	
$('#payment_type_id').val("1").trigger('change');

$('#referral_affiliate_id').val('');
	
$('#payment_type_id').change( function(){

	if( $(this).val() == 4 ){
		$('#paypal_email').show();
	}else{
		$('#paypal_email').hide();
	}

});
	
	
	$("#form").submit(function() {
	$(".error").hide();
	    var hasError = false;
        var firstName = $("#contact_first_name").val();
        var lastName = $("#contact_last_name").val();
        var emailAddress = $("#contact_email_address").val();
        var phone = $("#contact_phone_work").val();
        var address1 = $("#address_street").val();
        var city = $("#address_city").val();
        var zipCode = $("#address_zip_code").val();
        var passwordVal = $("#contact_password").val();
        var checkVal = $("#contact_password_check").val();
        var taxID = $("#ssn_tax_id").val();
        var affiliateName = $("#affiliate_name").val();
		var website = $("#website").val();
		var paymenttype = $("#payment_type_id").val();
		var paymentinfo = $("#payment_type_info").val();
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

		if( !$('#referral_affiliate_id').val() ){
			$('#referral_affiliate_id').val(0)
		};

		if (address1 == ''){
			$("#address_street").after('<span class="error r" style="color:#ff0000"> Please enter an address.</span>');
		    alert("Please enter your address");
			$("#address_street").focus();
			return false;		
		}else if (city == ''){
			$("#address_city").after('<span class="error r" style="color:#ff0000"> Please enter a city.</span>');
		    alert("Please enter your city");
			$("#address_city").focus();
			return false;		
		}else if (zipCode == ''){
			$("#address_zip_code").after('<span class="error r" style="color:#ff0000"> Please select a state.</span>');
		    alert("Please select your zip code");
			$("#address_zip_code").focus();
			return false;
		}else if (website == ''){
			$("#website").after('<span class="error r" style="color:#ff0000"> Please enter a website.</span>');
		    alert("Please enter a website");
			$("#website").focus();
			return false;				
        }else if (firstName == ''){
        	$("#contact_first_name").after('<span class="error r" style="color:#ff0000"> Please enter a first name.</span>');
			alert("Please enter your first name");
			$("#contact_first_name").focus();
			return false;
        }else if (lastName == ''){
            $("#contact_last_name").after('<span class="error r" style="color:#ff0000"> Please enter a last name.</span>');
            alert("Please enter your last name");
			$("#contact_last_name").focus();
			return false;
		}else if (phone == ''){
			$("#contact_phone_work").after('<span class="error r" style="color:#ff0000"> Please enter a number.</span>');
		    alert("Please enter your phone number");
			$("#contact_phone_work").focus();
			return false;
		}else if ( emailAddress == '' || !emailReg.test( emailAddress ) ){
		    $("#contact_email_address").after('<span class="error r" style="color:#ff0000"> Please enter a valid email address.</span>');
            alert("Please enter a valid email address");
			$("#contact_email_address").focus();
			return false;
		}else if (passwordVal == '') {
            $("#password").after('<span class="error r" style="color:#ff0000"> Please enter a password.</span>');
		    alert("Please enter a password");
			$("#password").focus();
			return false;	
		} else if (checkVal == '') {
            $("#contact_password_check").after('<span class="error r" style="color:#ff0000"> Re-enter your password.</span>');
		    alert("Please enter verification password");
			$("#contact_password_check").focus();
			return false;			
		}else if (taxID == ''){
			$("#ssn_tax_id").after('<span class="error r" style="color:#ff0000"> Please enter a Tax ID.</span>');
		    alert("Please enter your Tax ID");
			$("#ssn_tax_id").focus();
			return false;
		}else if (paymenttype == 4 && !paymentinfo || !emailReg.test( paymentinfo ) ){
			$("#payment_type_info").after('<span class="error r" style="color:#ff0000"> Please enter a valid PayPal email.</span>');
		    alert("Please enter a valid PayPal email");
			$("#payment_type_info").focus();
			return false;			
        } else if (passwordVal != checkVal ) {
            $("#contact_password").after('<span class="error r" style="color:#ff0000">Passwords do not match.</span>');
            $("#contact_password_check").after('<span class="error r" style="color:#ff0000">Passwords do not match.</span>');
		    alert("Please verify your password");
			$("#contact_password").focus();      
			return false;
			}
        	if(jQuery("#terms").is(":checked")){
        		if (affiliateName == ''){
        			$('#affiliate_name').val($('#contact_first_name').val() + ' ' + $('#contact_last_name').val());
        		}
				values = encodeURIComponent($('#form').serialize());
				//values = $('#form').serialize();
				$.ajax({
				type: 'GET',
				url: phpfileurl + '?url=' + signup + values + '&callback=?',
				//data: values + '&callback=?',
				dataType: 'jsonp',
				async: false,
				success: function(data){
				
				//var xml = data.contents;
				var xml = $.parseXML(data.contents);
				//var response = xml.find('message');
				var response = $(xml).children().find('message').text();
				if( response == 'Affiliate Added Successfully'){
					document.location.href= thankyoupage;// + '?p=' + $.base64.encode(passwordVal) + '&u=' + $.base64.encode(emailAddress);
				}else{
					alert( response );
					$('#referral_affiliate_id').val('');
					return false;
				};
			}
			});
       	}else{
       		alert("Please agree to terms and conditions.");
       		return false;
       	}
	return false;  
    });
 });
 
 "use strict";jQuery.base64=(function($){var _PADCHAR="=",_ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_VERSION="1.0";function _getbyte64(s,i){var idx=_ALPHA.indexOf(s.charAt(i));if(idx===-1){throw"Cannot decode base64"}return idx}function _decode(s){var pads=0,i,b10,imax=s.length,x=[];s=String(s);if(imax===0){return s}if(imax%4!==0){throw"Cannot decode base64"}if(s.charAt(imax-1)===_PADCHAR){pads=1;if(s.charAt(imax-2)===_PADCHAR){pads=2}imax-=4}for(i=0;i<imax;i+=4){b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6)|_getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")}function _getbyte(s,i){var x=s.charCodeAt(i);if(x>255){throw"INVALID_CHARACTER_ERR: DOM Exception 5"}return x}function _encode(s){if(arguments.length!==1){throw"SyntaxError: exactly one argument required"}s=String(s);var i,b10,x=[],imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8)|_getbyte(s,i+2);x.push(_ALPHA.charAt(b10>>18));x.push(_ALPHA.charAt((b10>>12)&63));x.push(_ALPHA.charAt((b10>>6)&63));x.push(_ALPHA.charAt(b10&63))}switch(s.length-imax){case 1:b10=_getbyte(s,i)<<16;x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_PADCHAR+_PADCHAR);break;case 2:b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8);x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_ALPHA.charAt((b10>>6)&63)+_PADCHAR);break}return x.join("")}return{decode:_decode,encode:_encode,VERSION:_VERSION}}(jQuery));
