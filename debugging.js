




//
// sets the debug button to visible in the input is not 0
function hide_show_debug_button(value)
{
    if (parseInt(value) == 0)
    {
        document.getElementById('Debugging_switch').style.visibility = "hidden";
        document.getElementById('Debugging_switch').style.display = "none";
    }
    else
    {
        document.getElementById('Debugging_switch').style.visibility = "visible";
        document.getElementById('Debugging_switch').style.display = "block";
    }
}




var state = 0;
function hide_show_debug_data()
{
//    var myDiv = document.getElementById('studInfo');
    switch  (state)
    {
        case 0:
            document.getElementById('Debugging').style.visibility = "hidden";
            document.getElementById('Debugging').style.display = "none";
            document.getElementById('hide_button').value = "Show data";
            state = 1;
            break;

        case 1:
            document.getElementById('Debugging').style.visibility = "visible";
            document.getElementById('Debugging').style.display = "block";
            document.getElementById('hide_button').value = "Hide data";
            state = 0;
            break;
    }
}