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

$(document).ready(function () {
    $("#send").click(function () {
        if ($("#name").val() == "") {
            alert("你尚未填寫姓名");
            eval("document.form1['name'].focus()");
        } else if ($("#beginPrice").val() == "") {
            alert("你尚未填寫價格");
            eval("document.form1['beginPrice'].focus()");
        } else if ($("#time").val() == "") {
            alert("你尚未填寫時間");
            eval("document.form1['time'].focus()");
        } else {
            document.form1.submit();
        }
    })
});