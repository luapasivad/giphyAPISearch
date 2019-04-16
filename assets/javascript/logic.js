$(document).ready(function() { 

    var buttonsArr = [],
        buttonDiv = $('#button-div')
        gifDiv = $('#gif-div')
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
            .attr('class', 'btn btn-primary btn-sm')
            .prependTo( $(buttonDiv) );
        }
    }

    function findGif(string) {
        var toSearch = string // sets the dynamic api link
        var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=d0oobYxRk095EpbUG3rFBW8diHv0ioio&q=' + toSearch +'&limit=10&offset=0&rating=G&lang=en'
            
        $.ajax({ // ajax call for user made buttons
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                for (var i=0; i<10; i++) { // takes all 10 results
                    var gifPicture = response.data[i].images.downsized_medium.url
                    $('<img>') // prepends them to the screen
                        .attr('src', gifPicture)
                        .prependTo( $(gifDiv) )
                }
            })
        }

    $('#button-div').on('click', 'button', function() { // original buttons
        findGif( $(this).attr('data-nameFull'))
    })
        // console.log($(this).attr('data-nameFull'))

    $('#search-div').on('click', 'button', function() { // user made buttons
        var userSearch = $('#userSearch')
        var search = userSearch.val()

        if (search.length != "") {
            buttonCreate(search)
            findGif(search)
            console.log(search)
            userSearch.val("") // clear text box
        }
    })

    
})