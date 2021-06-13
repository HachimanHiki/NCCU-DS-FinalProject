let refreshButton = $('#refreshButton');
let EndButton = $('#EndButton');

let nowitem = null;

let nowID;

function showitem(ID) {
    //console.log(i)
    $.get('/changeitem', {
        ID: ID
    }, function (result) {
        //console.log(result)
        nowitem = result.GoodName
        $('#GoodName').text('商品名稱: ' + result.GoodName)
        $('#StartPrice').text('起標價: ' + result.StartPrice)
        $('#CurrentPrice').text('目前標價: ' + result.CurrentPrice)
        $('#Deadline').text('截標時間: ' + result.Deadline)
        $('#GoodDescription').text('商品說明:' + result.GoodDescription)
        nowID = ID;
    })
}
refreshButton.on('click', function () {
    $.get('/display', {
    }, function () {
        window.location.reload();
    })
})
EndButton.on('click', function () {
    if (nowitem != null) {
        $.get('/endbidding', {
            name: nowitem
        }, function (result) {
            nowitem = null;
            window.location.reload();
        })
    }
})

function biditem() {
    //console.log(i)
    $.post('/updatePrice', {
        ID: nowID,
        price: parseInt($('#bidPrice').val(), 10)
    }, function () {
        showitem(nowID);
    })
}