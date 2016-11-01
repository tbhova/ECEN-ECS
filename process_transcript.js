


function clear_data () 		// clears all the transcript data
{
    all_courses.splice(0, all_courses.length);
    duplicate_courses.splice(0, duplicate_courses.length);

    student_name = "";
    student_major = "";
    student_dept = "";
    student_minor = "";
    last_major_for_a_term = "";

    document.getElementById('bannerInfo').innerHTML = "";
    document.getElementById('studInfo').innerHTML = "";
    document.getElementById('transferCourses').innerHTML = "";
    document.getElementById('YSUCourses').innerHTML = "";
    document.getElementById('currentCourses').innerHTML = "";
    document.getElementById('transcriptTotals').innerHTML = "";
    document.getElementById('header_data').innerHTML = "";
    document.getElementById('course_data').innerHTML = "";
    document.getElementById('major_by_term_data_to_send').value = "";
    document.getElementById('transcript_to_send').value = "";
}   // function clear_data






//  get_blank_sheet()  is used to generate a curriculum sheet w/o transcript information
// 	currently, a major is requitred, so that is put in the header field

function get_blank_sheet ()
{
    var data;
    clear_data();



    document.getElementById('header_data').innerHTML += "MAJOR_TRANS:Computer Science, Computer Science;";
    document.getElementById('header_data').innerHTML += "TRANS_MAJOR:Computer Science;";
    document.getElementById('header_data').innerHTML += "NAME:Blank Sheet;";
    document.getElementById('header_data').innerHTML += "BANNER:Y00000000;";


//  send the form data
    document.getElementById('header_data_to_send').value =
        document.getElementById('header_data').innerHTML

    document.getElementById('textInput').value = "Paste your data here";
    document.getElementById('data_to_send_form').submit();

    return;
}




function process_the_transcript ()
{
    var data;
    clear_data();

    data = document.getElementById('textInput').value;
    document.getElementById('transcript_to_send').value = data;

//
//	check for starting header and ending trailer to make sure all was copied.
//	add check for "Academic Transcript" since student version is DIFFERENT     KAS 7/16/2013
    if (!((/Student AcademicTranscript/.test (data) || /Academic Transcript/.test(data))
        && /Ellucian Company/.test(data)))
    {
        alert ("it appears you did not enter the ENTIRE transcript \nPlease paste it in the box");
        document.getElementById('textInput').value = "Paste Transcript data here";
        return;
    }
    split_into_fields (data);
    data = "";		// clear the data since it is no longer needed

    get_Student_Info (document.getElementById('studInfo').innerHTML);
    get_Banner_Info (document.getElementById('bannerInfo').innerHTML);
    get_Transfer_Course (document.getElementById('transferCourses').innerHTML);
    get_YSU_Course (document.getElementById('YSUCourses').innerHTML);
    get_Current_YSU_Course (document.getElementById('currentCourses').innerHTML);

    print_course_list();




//  send the form data
    document.getElementById('header_data_to_send').value =
        document.getElementById('header_data').innerHTML
    document.getElementById('course_data_to_send').value =
        document.getElementById('course_data').innerHTML
    document.getElementById('textInput').value = "Paste your data here";
    document.getElementById('data_to_send_form').submit();

    return;
}





function split_into_fields (data)
{

    var sections = split_into_fields_utility (data,
        "Y00",
        "STUDENT INFORMATION", "TRANSFER CREDIT ACCEPTED",
        "INSTITUTION CREDIT", "COURSES IN PROGRESS",
        "TRANSCRIPT TOTALS");

// 		put the appropriate section in the corresponding text box
    for (i = 1; i < sections.length; i++)
    {
        if (/Y00\d\d\d\d\d\d/.test(sections[i]))
        {
            document.getElementById('bannerInfo').innerHTML = sections[i];
        }
        if (/STUDENT INFORMATION/.test(sections[i]))
        {
            document.getElementById('studInfo').innerHTML = sections[i];
        }
        if (/TRANSFER CREDIT/.test(sections[i]))
        {
            document.getElementById('transferCourses').innerHTML = sections[i];
        }
        if (/INSTITUTION CREDIT/.test(sections[i]))
        {
            document.getElementById('YSUCourses').innerHTML = sections[i];
        }
        if (/TRANSCRIPT TOTALS/.test(sections[i]))
        {
            document.getElementById('transcriptTotals').innerHTML = sections[i];
        }
        if (/COURSES IN PROGRESS/.test(sections[i]))
        {
            document.getElementById('currentCourses').innerHTML = sections[i];
        }
    } 	// end of for
    return;
}







function get_Banner_Info(data)
{
    var data_to_add = "";
    var banner_requestor_date = data.match(/(Y00\d\d\d\d\d\d).{5,50}(\d\d\d\d)/g);

    var xx = banner_requestor_date + "";
    var list = xx.split(/\s+/g);
    var banner_id = list[0];

//	Turn on Debugging if requestor is Y00408142
    if (banner_id . match(/Y00408142/)  /* && 0 */ )   // and with zero to disable;  KAS 5/21/2013
    {
        hide_show_debug_button(1);
        data_to_add = data_to_add + "DEBUG:KAS;";
    }

    var requestor = list[1];
    for (var i=2; i < list.length-3; i++)
    {
        requestor += " " + list[i];
    }

    data_to_add += "REQUESTOR:" + requestor + ";";
    window.requestor_name = requestor;

    data_to_add += "BANNER:" + banner_id + ";";

    var date = "";
    date = list[list.length-3] + ' ' + list[list.length-2] + ' ' + list[list.length-1];
    data_to_add += "DATE:" + date + ";";
    document.getElementById('header_data').innerHTML += data_to_add;

    return;
}




function get_Student_Info(data)
{

    var sections = split_into_fields_utility (data,
        'Name :', 'Major and Department:', 'Minor:', '\\*\\*\\*Transcript',
        'Birth Date:', 'Student Type:');
    for (i = 1; i < sections.length; i++)
    {
//		test each of the sections;
//			could use continue after each test

        if (/Name :/.test(sections[i]))
        {
            student_name = sections[i].replace(/Name :\s(.*)/, "$1");
            student_name = student_name.replace(/(.*\S)\s*/, "$1");
            head_data = document.getElementById('header_data').innerHTML;
            head_data = "NAME:" + student_name + ";" + head_data;
            document.getElementById('header_data').innerHTML = head_data;
        }
        if (/Program:/.test(sections[i]))
        {
            student_program = sections[i].replace(/.*Program:\s+(\S*)\s.*/, "$1");
            document.getElementById('header_data').innerHTML += "TRANS_PROG:" + student_program + ";";
        }
        if (/College:/.test(sections[i]))
        {
            student_college = sections[i].replace(/College:\s(.*)/, "$1");
        }
        if (/Major and Department:/.test(sections[i]))
        {
            student_major_and_dept = sections[i].replace(/Major and Department:\s(.*)/, "$1"); 	// find string containing "major, dept"
            //  remove Secondary information
            if (/Secondary/.test(student_major_and_dept))
            {
                student_major_and_dept = student_major_and_dept.replace(/(.*\S)\s+Secondary.*/, "$1");
            }
            student_major = student_major_and_dept.match(/^[^\,]+/);
            student_dept = student_major_and_dept;
            student_dept = student_dept.replace(/^.*\,(.*)/, "$1");
            document.getElementById('header_data').innerHTML += "MAJOR_TRANS:" + student_major_and_dept + ";";
            document.getElementById('header_data').innerHTML += "TRANS_MAJOR:" + student_major + ";";
            document.getElementById('header_data').innerHTML += "TRANS_DEPT:" + student_dept + ";";
        }
        if (/Minor:/.test(sections[i]))
        {
            student_minor = sections[i].replace(/Minor:\s(.*)/, "$1");
            student_minor = student_minor.replace(/(.*\S)\s*/, "$1");
            //  remove secondary information
            if (/Secondary/.test(student_minor))
            {
                student_minor = student_minor.replace(/(.*\S)\s+Secondary.*/, "$1");
            }
            //  remove Certificate information
            if (/Certif/.test(student_minor))
            {
                student_minor = student_minor.replace(/(.*\S)\s+Certif.*/, "$1");
            }
            document.getElementById('header_data').innerHTML += "MINOR:" + student_minor + ";";
        }
    }	// end of for
    return;
}









// takes term in form of "Winter_1234" or "Winter 1234" and formats it to "W_1234"
//
function format_term(unformatted_term)
{

    working_term = working_term.replace (/(Winter)[ _](\d\d\d\d)/, "W_$2");
    working_term = working_term.replace (/(Spring)[ _](\d\d\d\d)/, "S_$2");
    working_term = working_term.replace (/(Summer)[ _](\d\d\d\d)/, "X_$2");
    working_term = working_term.replace (/(Fall)[ _](\d\d\d\d)/, "F_$2");
    return working_term;
}





function get_Transfer_Course(data)
{

//	Changed 3-8-2013;   changed the Title section to allow a blank title; assumes tabs on each side of title
//                         DEPT    CAT               Title          grd      hours           hours
// var course_Regex = /^\s*(\S+)\s+(\d\d\S{2,4})[^\t]*\t([^\t]*)\s+(\w{1,4})\s+(\d+\.\d\d\d)\s+(\d+\.\d\d)/;

//	Changed 5/27/2016;   changed the CAT section to allow a three digit catalog number
//                         DEPT    CAT               Title          grd      hours           hours
    var course_Regex = /^\s*(\S+)\s+(\d{1,2}\S{2,4})[^\t]*\t([^\t]*)\s+(\w{1,4})\s+(\d+\.\d\d\d)\s+(\d+\.\d\d)/;

//    assume tabs between fields


//		Prepend marker (XXENDXX-) for each identified section
    data = data.replace(/((TUTION\s+\-Top\-)|(Quality Points\s+R)|(Term Totals))/g, "XXENDXX-$1");
    var sections = data.split("XXENDXX-");

    for (var i = 1; i < sections.length; i++)
    {
        if (/TUTION\s+\-Top\-([^:]*)/.test(sections[i]))
        {
//	    working_term = format_term(sections[i].replace(/TUTION\s+\-Top\-([^:]*).*/, "$1"));
//
//	KAS 11-05-2015 changed default term from F_1960 to Transfer
//	    working_term = "F_1960";
            working_term = "Transfer";
        }
        if (/Quality Points\s+R/.test(sections[i]))
        // have header for classes within one (graded) term
        {
            course_list = sections[i].replace(/Quality Points\s+R\s(.*)/, "$1");
            process_graded_course_list(course_list, course_Regex, "Transfer");
        }
    }	// end of for
}



function find_major_for_term (formatted_term, term_string)
{
    var internal_major = "UnImplemented";
    var major = term_string.replace(/Term:\s.*Major:\s+(.*)Student Type:\s+.*/, "$1");

    pattern_for_pre = /Pre Information|Pre Computer|STEM Technology/;
    if (pattern_for_pre.test(major))
    {
        internal_major = "CSIS-Pre";
    }

    var pattern_for_IT = /Information Technology/;
    if (internal_major != "CSIS-Pre" && pattern_for_IT.test(major))
    {
        internal_major = "CSIS-IT";
    }

    var pattern_for_CIS = /Computer Info/;
    if (internal_major != "CSIS-Pre" && pattern_for_CIS.test(major))
    {
        internal_major = "CSIS-CIS";
    }

    var pattern_for_CSCI = /Computer Science/;
    if (internal_major != "CSIS-Pre" && pattern_for_CSCI.test(major))
    {
        internal_major = "CSIS-CSCI";
    }

    if (internal_major == "UnImplemented")
    {
        internal_major = major;
    }


//    alert ("In term: " + formatted_term + " have major: " + major);
    if (internal_major != last_major_for_a_term)
    {
        last_major_for_a_term = internal_major;
        document.getElementById('major_by_term_data_to_send').value +=  formatted_term + "," + internal_major + ";";
//	alert (" major is now: " + document.getElementById('major_by_term_data_to_send').value);
    }
}




function get_YSU_Course(data)
{
    var course_Regex = /(\w{2,4})\s+(\d\d\d\S*)\s+\S+\s+(.*)\s+(\w+)\s+(\d+\.\d\d\d)\s+(\d+\.\d+)/;
//    Tag Beginning of Course list
    data = data.replace (/(Quality Points\s+R)/g, "END_OF_TERM_HEADER");
    var sections = split_into_fields_utility (data,
        'Term: [FWS]', 'END_OF_TERM_HEADER', 'Term Totals');

    for (var i = 1; i < sections.length; i++)
    {
        if (/Term:\s(((Fall)|(Spring)|(Summer)|(Winter))\s\d\d\d\d)/.test(sections[i]))
        {
            working_term = sections[i].replace(/Term:\s+(((Fall)|(Spring)|(Summer)|(Winter))\s\d\d\d\d).*/, "$1");
            working_term = format_term(working_term.replace(/(\S+)\s(\d\d\d\d)/, "$1_$2"));
            find_major_for_term(working_term, sections[i]);
//	alert (" major is now: " + document.getElementById('major_by_term_data_to_send').innerHTML);
        }
        if (/END_OF_TERM_HEADER/.test(sections[i]))
        // have header for classes within one (graded) term
        {
            course_list = sections[i].replace(/END_OF_TERM_HEADER\s(.*)/, "$1");
            process_graded_course_list(course_list, course_Regex, "YSU");
        }
    }	// end of for

}


function get_Current_YSU_Course(data)
{
    var course_Regex = /^\s*(\S*)\s+(\d\d\S*)\s+\S+\s+(.*)\s+(\d+\.\d\d\d)/;
//    Tag Beginning of Course list
    data = data.replace (/(Title\s+Credit Hours\s+)/g, "END_OF_TERM_HEADER");
    var sections = split_into_fields_utility (data,
        'Term: [FWS]', 'END_OF_TERM_HEADER', 'Unofficial Transcript');

    for (var i = 1; i < sections.length; i++)
    {
        if (/Term:\s(((Fall)|(Spring)|(Summer)|(Winter))\s\d\d\d\d)/.test(sections[i]))
        {
            working_term = sections[i].replace(/Term:\s+(((Fall)|(Spring)|(Summer)|(Winter))\s\d\d\d\d).*/, "$1");
            working_term = format_term(working_term.replace(/(\S+)\s(\d\d\d\d)/, "$1_$2"));
            find_major_for_term(working_term, sections[i]);
//	alert (" major is now: " + document.getElementById('major_by_term_data_to_send').innerHTML);
        }
        if (/END_OF_TERM_HEADER/.test(sections[i]))
        // have header for classes within one (graded) term
        {
            course_list = sections[i].replace(/END_OF_TERM_HEADER\s*(.*)/, "$1");
            process_ungraded_course_list(course_list, course_Regex, "Current");
        }
    }	// end of for
}



//  filter courese title removes "special" characters from the course name
//  removed characters include:
//	&
//	&amp;	(due  to HTTP transfer
//	:
//	;
function filter_course_title (course_title)
{
    course_title = course_title.replace(/(.*\S)\s*/, "$1");	// remove trailing space
//
//	the '&' in the data causes problems (by repalcing it with "&amp;" the semicolon is the problem)
//		Most notablely is when the & is in the course name.
//		I don't see any use for the & so just get rid of it!!
//		I have run across cases of multiple & in one course description!!
    course_title = course_title.replace(/&amp;/g, "and");
    course_title = course_title.replace(/&/g, "and");

    course_title = course_title.replace(":", " ");	// convert ":" to " "
    course_title = course_title.replace(";", " ");	// convert ";" to " "
    return course_title;
}




function process_graded_course_list (data, course_Regex, where_taken)
{

    var course_list = data.replace(/((\d+\.\d\d\d\s+\d+\.\d\d))/g, "$1-YYENDYY");
    var working_list = course_list.split("-YYENDYY");
    for (var i = 0; i < working_list.length; i++)
    {
        // should be one course per working_list entry
        if (course_Regex.test(working_list[i]))
        {
            var course_info = course_Regex.exec(working_list[i]);
            var course_hash = new Array();
            course_hash["term"] = working_term;
            course_hash["catalog"] = course_info[1] + "_" + course_info[2];
            course_hash["title"] = filter_course_title(course_info[3]);
            course_hash["grade"] = course_info[4];
            course_hash["credit_hours"] = course_info[5];
            course_hash["qp"] = course_info[6];
            course_hash["where"] = where_taken;
            all_courses.push(course_hash);
        }
    }
}



function process_ungraded_course_list (data, course_Regex, where_taken)
{
    var course_list = data.replace(/((\.000\s+))/g, "$1-YYENDYY");
    var working_list = course_list.split("-YYENDYY");
    for (var i = 0; i < working_list.length; i++)
    {
        // should be one course per working_list entry
        if (course_Regex.test(working_list[i]))
        {
            var course_info = course_Regex.exec(working_list[i]);
            var course_hash = new Array();
            course_hash["term"] = working_term;
            course_hash["catalog"] = course_info[1] + "_" + course_info[2];
            course_hash["title"] = filter_course_title(course_info[3]);
            course_hash["grade"] = "***";
            course_hash["credit_hours"] = course_info[4];
            course_hash["qp"] = "0";
            course_hash["where"] = where_taken;
            all_courses.push(course_hash);
        }
    }
}










function print_course_list()
{

    var transcript_form_data = "";

    for (var i=0; i < all_courses.length; i++)
    {
        transcript_form_data += i + ":";
        if (all_courses[i].hasOwnProperty('where'))
        {
            if (all_courses[i]['where'] == "YSU" || all_courses[i]['where'] == "Current" )
                transcript_form_data += "YSUCLASS"
            else
                transcript_form_data += "TRNCLASS";
        }
        else
            transcript_form_data += ":";
        if (all_courses[i].hasOwnProperty('term'))
            transcript_form_data += ":" + all_courses[i]['term'];
        else
            transcript_form_data += ":";

        if (all_courses[i].hasOwnProperty('catalog'))
            transcript_form_data += ":" + all_courses[i]['catalog'];
        else
            transcript_form_data += ":";

        if (all_courses[i].hasOwnProperty('title'))
            transcript_form_data += ":" + all_courses[i]['title'];
        else
            transcript_form_data += ":";

        if (all_courses[i].hasOwnProperty('grade'))
            transcript_form_data += ":" + all_courses[i]['grade'];
        else
            transcript_form_data += ":";

        if (all_courses[i].hasOwnProperty('credit_hours'))
            transcript_form_data += ":" + all_courses[i]['credit_hours'];
        else
            transcript_form_data += ":";

//    put in "effective course" same as real course
//  KAS 11/16/12   remove the effective course; do it in Perl on server
//	transcript_form_data += ":" + all_courses[i]['catalog'] + ";";	// mark end of line for course
        transcript_form_data += ";";	// mark end of line for course

    }
    document.getElementById('course_data').innerHTML
        +=  transcript_form_data;

}