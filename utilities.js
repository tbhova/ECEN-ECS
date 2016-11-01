



//  browser_validate	detects if using
//			Internet Explorer
//	if so sends an alert
//
function browser_validate ()
{
    if (/MSIE /.test(navigator.userAgent))  	// test for MSIE
    {
        alert ("Internet Explorer is not supported\nTry using FireFox");
        document.getElementById("buttonProcessData").disabled=true ;
    }
}




//  get_term_number  converts a term in the form of (Fall)(Winter)... 1900 to an integer
//			the number is 10 times the year + 1 for Winter
//							  2 for Spring
//							  3 for Summer
///							  4 for Fall
//	returns a 0 if an error is found
function get_term_number ()
{
    var term_number = 0;
    var term_string = arguments[0];
    if (/(\w*)\_(\d\d\d\d)/.test(term_string))
    {
        var parts = (/(\w*)\_(\d\d\d\d)/).exec(term_string);
        term_number = 10 * parseInt(parts[2]);
    }
    if (parts[1] == "Winter")
        term_number += 1;
    if (parts[1] == "Spring")
        term_number += 2;
    if (parts[1] == "Summer")
        term_number += 3;
    if (parts[1] == "Fall")
        term_number += 4;

    return term_number;
}


function get_term_string () 	// undoes above function, given a number, return string
{
    var term_number = arguments[0];
    var year = parseInt (term_number/10);
    var term_number = parseInt(term_number) - 10 * year;
    switch (term_number)
    {
        case 1:
            return "Winter_" + year;
        case 2:
            return "Spring_" + year;
        case 3:
            return "Summer_" + year;
        case 4:
            return "Fall_" + year;
    }
    return "";	// Error condition
}



// split
// arg_1 is string to process (unchanged)
// then a list of seperators, one per argument; not limited

//	NOTE: arguments should be passed by parameters with single quotes if they have
//			any \ characters  to avoid interpertaion
//
function split_into_fields_utility ()
{
    var data = arguments[0];
    var expression = "(" + arguments[1] + ")";

    for (var i=2; i < arguments.length; i++)
    {
        expression = expression + "|(" + arguments[i] + ")";
    }
    expression = "(" + expression + ")";
    var patt = new RegExp (expression, "g");

//		Prepend marker (XXENDXX-) for each identified section
    data = data.replace(patt, "XXENDXX-$1");
    var sections = data.split("XXENDXX-");

    return sections;
}