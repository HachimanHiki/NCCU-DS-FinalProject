let refreshButton = $('#refreshButton');
let EndButton = $('#EndButton');

function showitem(ID){
    //console.log(i)
    $.get('/changeitem', {
        ID : ID
    }, function (result) {
                //console.log(result)
        			$('#GoodName').text('商品名稱: ' + result.GoodName)
        			$('#StartPrice').text('起標價: ' + result.StartPrice)
        			$('#CurrentPrice').text('目前標價: ' + result.CurrentPrice)
        			$('#Deadline').text('截標時間: ' + result.Deadline)
        			$('#GoodDescription').text('商品說明:' + result.GoodDescription)
        		})
}
refreshButton.on('click', function () {
		$.get('/display', {
		}, function () {
            window.location.reload(); 
		})	
})
EndButton.on('click', function () {
    $.get('/endbidding', {
    }, function (result) {
        // console.log(result)
        window.location.reload(); 
    })	
})