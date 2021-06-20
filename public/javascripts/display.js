let refreshButton = $('#refreshButton');
let EndButton = $('#EndButton');
let bidEmail = $('#bidEmail');
let bidPrice = $('#bidPrice');
let history = $('#history');

let nowitem = null;
let nowID;

const emailRule = `[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+`;

function showitem(ID) {
    //console.log(i)

    $.get('/changeItem', {
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

        //displayHistory()
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

function bidItem() {
    if (bidEmail.val().search(emailRule) == -1) {
        alert("電子信箱格式不符");
        return;
    }

    if (!nowID) {
        alert("請先選擇競標商品");
        return;
    }

    $.post('/updateItemPrice', {
        ID: nowID,
        price: parseInt(bidPrice.val(), 10),
        email: bidEmail.val()
    }, function (result) {
        if(result.error) {
            alert(result.error);
        }
        else {
            showitem(nowID);
            bidPrice.val("")
            bidEmail.val("")
            alert('成功競標物品');
        }
    })
}

function displayHistory() {
    $.get('/history', {
        ID: nowID,
    }, function (result) {
        console.log(result)
        history.html('');
        for (let i = 0; i < result.length; i++) {
            console.log(result)
            history.html(`時間:${result[i].endTime} 競標金額:${result[i].currentPrice}\n` + history.html())
        }
    })
}