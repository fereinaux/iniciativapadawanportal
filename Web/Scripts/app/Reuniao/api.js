function ExecApi() {
    var urlbase = $('#endpoint-movies').val()
    $.ajax({
        url: `${urlbase}/people`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#characters').text(data.count)
                $('#result-api').removeClass('d-none')
            }
        }
    })
    $.ajax({
        url: `${urlbase}/films`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#films').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/starships`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#starships').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/planets`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#planets').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/vehicles`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#vehicles').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/species`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#species').text(data.count)
            }
        }
    })
}