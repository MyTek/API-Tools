<?php
//Continue even if user disconnects
ob_start();
ignore_user_abort(true);
set_time_limit(0);

//Send success response
//header('Content-type: application/json');
//echo json_encode($_POST);

require_once realpath(__DIR__ . '/email.php');

//****************************************************************************
//domain for email 'from'
$domain = 'domain.com';
//location of this file
$url = 'http://www.domain.com/get-conversions/';
//****************************************************************************

//Get posted information
$days = $_POST['days'];
$email = $_POST['email'];
$data = explode(",", $_POST['data']);
$date = 'D' . date("Y-m-d");
$date .= 'T' . date("H-i-s");
$my_folder = 'SEARCHES/' . $date;
$write = array();
$matches = 0;
$file;

if(!file_exists('SEARCHES')){
mkdir('SEARCHES', 0755);
chmod('SEARCHES', 0755);
};

if(!file_exists($my_folder)){
mkdir($my_folder, 0755);
chmod($my_folder, 0755);
};

$params = array(
			api_key => 'zv008TbrMXQpyrQLflH0dW5YL6atTP',
			start_date => '',
			end_date => '',
			conversion_type => 'all',
			event_id => '0',
			affiliate_id => '0',
			advertiser_id => '0',
			offer_id => '0',
			affiliate_tag_id => '0',
			advertiser_tag_id => '0',
			offer_tag_id => '0',
			campaign_id => '0',
			creative_id => '0',
			price_format_id => '0',
			disposition_type => 'all',
			disposition_id => '0',
			affiliate_billing_status => 'all',
			advertiser_billing_status => 'all',
			test_filter => 'non_tests',
			start_at_row => '0',
			row_limit => '100000',
			sort_field => 'request_session_id',
			sort_descending => 'FALSE'
	);
				
function sendoutput(){//will send echo statement before script is finished so user doesnt have to wait for the file(s) to get transfered
	$content = ob_get_contents();         // Get the content of the output buffer
	ob_end_clean();                      // Close current output buffer
	$len = strlen($content);             // Get the length
	header('Connection: close');         // Tell the client to close connection
	header("Content-Length: $len");     // Close connection after $size characters
	echo $content;                       // Output content
	flush(); 
};

print_r( json_encode( 'Data Received' ) );
sendoutput();


//http://demo.cakemarketing.com/api/11/reports.asmx?op=Conversions
//brad@cakemarketing.com
//adminuser

//
//johndyeis@gmail.com
//john123
while( $days ){

	$days--;
	$start = -1 * $days;
	$start = date('m-d-Y', strtotime( "$start day -7 hours" ) );
	$end = -1 * ( $days - 1 );
	$end = date('m-d-Y', strtotime( "$end day -7 hours" ) );
	
	$params['start_date'] = $start;
	$params['end_date'] = $end;
	
	$ch = curl_init( "http://www.moxylogin.com/api/11/reports.asmx/Conversions?" . http_build_query( $params ) );
	
	//print_r("http://www.moxylogin.com/api/11/reports.asmx/Conversions?" . http_build_query( $params ));
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

	$rawxml = curl_exec($ch);
	curl_close($ch);

	$xml = simplexml_load_string( $rawxml );
	$json = json_encode($xml);
	$json = json_decode($json, true);
	//var_dump($json);
	$conversions = array();
	$conversions = $json['conversions']['conversion'];

if( !is_array($conversions) )
{
	$conversions[0] = $conversions;
}
//print_r($conversions);


	foreach( $conversions as $conversion => $cdata )
	{
		//$cdata['request_session_id'];
		
		if( in_array( $cdata['request_session_id'], $data ) )
		{
			$matches++;
			//print_r($cdata['request_session_id']);
			$count = 1;
			while( $count > 0 )
			{
				$count = 0;
				foreach( $cdata as $key => $value )
				{
					//print_r($value);
					if( is_array( $value ) )
					{
						//print_r($value);
						foreach( $value as $name => $move )
						{
							$cdata[$key . '-' . $name] = $move;
							if( isset($move) )
							{
								$count = 1;
							}
						}
						unset( $cdata[$key] );
					}
					
					//$cdata[$name] = array( $cdata[$move] );
				}
			}
			//print_r($write);
			if( count($cdata) != count($write) )
			{
				foreach( $write as $mergename => $mergedata )
				{
					if( !$cdata[$mergename] )
					{
						$cdata[$mergename] = ' ';
						//print_r($mergename);
					}
				}
			}
			$write = array_merge_recursive( $cdata, $write );
			
		}

	}
	
	//print_r( $write );

}

foreach( $write as $column => $entry )
{
	$file .= $column . ',';
}
$file .= "\n";
//print_r($file);
for( $i = 0; $i < $matches; $i++ )
{
	foreach( $write as $column => $entry )
	{
		$file .= preg_replace('/\,/i', '-', $entry[$i]) . ',';
	}
	$file .= "\n";
}

//print_r($file);


	$handle = fopen( $my_folder . '/' . $date . '.csv', 'w' ) or die( 'Cannot open file:  ' . $date );
	fwrite($handle, $file);
	fclose($handle);

$email = explode( ',', $email);
foreach( $email as $recipient )
{
$filepath = $url . $my_folder . '/' . $date . '.csv';
$localfilepath = $my_folder . '/' . $date . '.csv';
mail::sendMail( $recipient, "CONVERSIONS - ".  date("H:i:s"), "Direct file <a href='$filepath'>$date</a>", $localfilepath, '','' , true );
}




?>
