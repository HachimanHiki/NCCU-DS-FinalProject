// let ItemButton = $('#ItemButton');

function showitem(ID){
    var i = ID
    console.log(i)
    $.get('/changeitem', {
        ID : ID
    }, function (result) {
                console.log(result)
        			$('#GoodName').text('商品名稱: ' + result.GoodName)
        			$('#StartPrice').text('起標價: ' + result.StartPrice)
        			$('#CurrentPrice').text('目前標價: ' + result.CurrentPrice)
        			$('#Deadline').text('截標時間: ' + result.Deadline)
        			$('#GoodDescription').text('商品說明:' + result.GoodDescription)
        		})
}
// ItemButton.on('click', function () {
//         var id = this.dataset.id;
//         console.log(ItemButton.text())
// 		$.get('/changeitem', {
// 		}, function (result) {
//             console.log(result)
// 			// $('#GoodName').text('商品名稱: ' + result.GoodName)
// 			// $('#StartPrice').text('起標價: ' + result.StartPrice)
// 			// $('#CurrentPrice').text('目前標價: ' + result.CurrentPrice)
// 			// $('#Deadline').text('截標時間: ' + result.Deadline)
// 			// $('#GoodDescription').text('商品說明:' + result.GoodDescription)
//             $('#GoodName').text('商品名稱: ' + '111')
// 			$('#StartPrice').text('起標價: ' + '222')
// 			$('#CurrentPrice').text('目前標價: ' + '333')
// 			$('#Deadline').text('截標時間: ' + '444')
// 			$('#GoodDescription').text('商品說明:' + '555')
// 		})	
// })