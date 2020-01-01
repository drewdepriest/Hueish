<?php

// use this to generate every url below
$siteUrl = "http://drewdepriest.com/hueish";

// get search color from request object
$searchColor = $_GET['searchColor'];

// get article from request object
// options: jacket, tie, shirt, dress, pants, or socks
$searchArticle = $_GET['searchArticle'];

// search on keywords: color + article
$keywords = $searchColor . " " . $searchArticle;

// get search department from request object
// ex. search by "FashionMen" or "FashionGirls"
// *** NOTE: make sure to capitalize "M" in Men or "W" in Women (same for Boys, Girls, Baby)
$searchDep = $_GET['searchDep'];
$searchIndex = "Fashion" . $searchDep;


// Your AWS Access Key ID, as taken from the AWS Your Account page
//$aws_access_key_id = "ACCESS_KEY";
$aws_access_key_id = "ACCESS_KEY"; 

// Your AWS Secret Key corresponding to the above ID, as taken from the AWS Your Account page
//$aws_secret_key = "SECRET_KEY";
$aws_secret_key = "SECRET_KEY";

// The region you are interested in
$endpoint = "webservices.amazon.com";

$uri = "/onca/xml";

// SearchIndex options:
// - FashionMen
// - FashionWomen
// - FashionBoys
// - FashionGirls
// - FashionBaby

// Keywords options (to search by color):
// Black, Grey, White, Brown, Beige, Red, Pink, Orange, Yellow, Ivory, Green, Blue, Purple, Gold, Silver

// Sort option: 'relevancerank','popularity-rank','price','-price','reviewrank','launch-date'.

$params = array(
    "Service" => "AWSECommerceService",
    "Operation" => "ItemSearch",
    //"AWSAccessKeyId" => "ACCESS_KEY",
    "AWSAccessKeyId" => "ACCESS_KEY",
    "AssociateTag" => "ASSOC_TAG",
    "SearchIndex" => $searchIndex,
    "Keywords" => $keywords,
    "ResponseGroup" => "Images,ItemAttributes,ItemIds",
    "Sort" => "relevancerank"
);

// Set current timestamp if not set
if (!isset($params["Timestamp"])) {
    $params["Timestamp"] = gmdate('Y-m-d\TH:i:s\Z');
}

// Sort the parameters by key
ksort($params);

$pairs = array();

foreach ($params as $key => $value) {
    array_push($pairs, rawurlencode($key)."=".rawurlencode($value));
}

// Generate the canonical query
$canonical_query_string = join("&", $pairs);

// Generate the string to be signed
$string_to_sign = "GET\n".$endpoint."\n".$uri."\n".$canonical_query_string;

// Generate the signature required by the Product Advertising API
$signature = base64_encode(hash_hmac("sha256", $string_to_sign, $aws_secret_key, true));

// Generate the signed URL
$request_url = 'http://'.$endpoint.$uri.'?'.$canonical_query_string.'&Signature='.rawurlencode($signature);

echo "Signed URL:  <a href=".$request_url." target=_blank>" . $request_url . "</a><br/> <br/>";

$curl = curl_init();
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_URL, $request_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_TIMEOUT, 120);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');

$res = curl_exec($curl);
curl_close($curl);

$dom = new DOMDocument();
$dom->preserveWhiteSpace = FALSE;
$dom->loadXML($res);

// get each "item" object
$items = $dom->getElementsByTagName('Item');

echo "<table class=\"table\">";
$count = 1;
// loop through and get specific attributes from each
// (dynamically build the table along hte way)
foreach($items as $item){

    // item title
	$titles = $item->getElementsByTagName('Title');

    // item link (URL)
    $links = $item->getElementsByTagName('ItemLink');
    
    // item image
    $images = $item->getElementsByTagName('MediumImage');

    // item price
    $prices = $item->getElementsByTagName('ListPrice');
    
    // now print it all
    // start new row at item 1 and 6
    if($count == 1 || $count == 6){
        echo "<tr>";
    }

    echo "<td>";

    // make the picture and title clickable
    echo "<a target=_blank href=" . $links->item(0)->getElementsByTagName('URL')->item(0)->nodeValue  . ">";
    echo $titles->item(0)->nodeValue . "<br/>";

    // some items do not include an image in their listing - check for images before printing
    if(count($images->item(0)->childNodes) > 0){
        echo "<img src=" . $images->item(0)->getElementsByTagName('URL')->item(0)->nodeValue . ">";
    }else{
        echo "";
    }

    echo "<br/>";

    // some items do not include price in their listing - check for values before printing
    if(count($prices->item(0)->childNodes) > 0){
        echo $prices->item(0)->getElementsByTagName('FormattedPrice')->item(0)->nodeValue;
    }else{
        echo "";
    }

    if($count == 5 || $count == 10){
        echo "</tr>";
    }

    $count = $count + 1;
}

echo "</table>";

// get "more search results" URL
echo "<a target=_blank href=" . $dom->getElementsByTagName('MoreSearchResultsUrl')->item(0)->nodeValue . "><span style=\"font-size:1.5em;\" class=\"glyphicon glyphicon-plus\"></span>
 More results</a>";
echo "<br/><br/>";
?>
