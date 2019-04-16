$(document).ready(function() { 

    var buttonsArr = [],
        buttonDiv = $('#button-div')
        // button = $('#button') // not sure if necessary


    $.ajax({ // ajax call for default buttons
        url: 'https://api.giphy.com/v1/gifs/trending?api_key=d0oobYxRk095EpbUG3rFBW8diHv0ioio&limit=10&rating=G', // static URL - pulls first 15 trending pictures
        method: "GET"
        }).then(function(response) {
            for (var i=0; i<10; i++) {
                var title = response.data[i].title // get the title for each picture
                buttonCreate(title)
                
            }
        })
        

    function buttonCreate(string) {
        if (string.length != "" ) { // if it has a title
        titleDisplay = string.replace(/ GIF.*$/i, ""); // cut off everything after "GIF" including it in the title
        buttonsArr.push(titleDisplay); // add to buttonsArr
        // tempTitleSplit = tempTitle.split(" ",2) // to add data-name shortened to the first word
        console.log(titleDisplay)
        $('<button>')
            .text( titleDisplay )
            // .attr('data-name', tempTitleSplit[0])
            .attr('type', 'submit')
            .attr('data-nameFull', titleDisplay)
            .attr('id', 'button')
            .attr('class', 'btn btn-primary btn-sm btn-block')
            .appendTo( $(buttonDiv) );
        }
    }


    $('#button-div').on('click', 'button', function() {
        // console.log($(this).attr('data-nameFull'))
        var toSearch = $(this).attr('data-nameFull'),
            queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=d0oobYxRk095EpbUG3rFBW8diHv0ioio&q=' + toSearch +'&limit=10&offset=0&rating=G&lang=en'
        
        $.ajax({ // ajax call for defaiult buttons
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                console.log(response)
            })
    })

    $('#search-div').on('click', 'button', function() {
        var userSearch = $('#userSearch')
        var search = userSearch.val()

        console.log(search)
        userSearch.val("") // clear text box
    })

})