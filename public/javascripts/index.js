/*
$('#file').change(function () {
    var file = $('#file')[0].files[0];
    var reader = new FileReader;
    reader.onload = function (e) {
        $('#demo').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
});
*/
const emailRule = `[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+`;

$(document).ready(function () {
    $("#send").click(function () {
        if ($("#name").val() == "") {
            alert("你尚未填寫姓名");
            eval("document.form1['name'].focus()");
        } else if ($("#email").val().search(emailRule) == -1 ) {
            alert("電子信箱格式不符");
            eval("document.form1['email'].focus()");
        } else if ($("#beginPrice").val() == "") {
            alert("你尚未填寫價格");
            eval("document.form1['beginPrice'].focus()");
        } else if ($("#time").val() == "") {
            alert("你尚未填寫時間");
            eval("document.form1['time'].focus()");
        } else if ( new Date($("#time").val()) <= new Date() ) {
            alert("結標日期不能在今天以前");
            eval("document.form1['time'].focus()");
        } else {
            document.form1.submit();
        }
    })
});