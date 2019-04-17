$(document).ready(function() { 

    var buttonsArr = [],
        buttonDiv = $('#button-div')
        gifDiv = $('#gif-div')
        // button = $('#button') // not sure if necessary


    $.ajax({ // ajax call for default buttons
        url: 'https://api.giphy.com/v1/gifs/trending?api_key=RKxTO3lSjjLNbawYu2mYoLiRuU76x6iO&limit=10&rating=G', // static URL - pulls first 15 trending pictures
        method: "GET"
        }).then(function(response) {
            console.log(response) // for test
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
        var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=RKxTO3lSjjLNbawYu2mYoLiRuU76x6iO&q=' + toSearch +'&limit=10&offset=0&rating=G&lang=en'
            
        $.ajax({ // ajax call for user made buttons
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                for (var i=0; i<10; i++) { // takes all 10 results
                    console.log(response)
                    var gifPicture = response.data[i].images.downsized.url // moving URL
                    var stillPicture = response.data[i].images.downsized_still.url // still URL
                    var gifName = response.data[i].title.replace(/ GIF.*$/i, ""); // gif title with end cut off
                    var userGif;

                    if (response.data[i].username != "") { // needs work
                        userGif = " - " + response.data[i].username
                    } else {
                        userGif = ""
                    }
    


                    $('<div>') // container holding each gif and its info
                        .attr('id', 'gifContainer') // targeting
                        .attr('class', 'gif') // styling
                        .prependTo( $(gifDiv) )

                    $('<div>') // text placed within container
                        .attr('id', 'gifText') // targeting & styling
                        .text(gifName + userGif) // title - user
                        .prependTo( $('#gifContainer') ) // 

                    $('<img>') // prepends them to the screen
                        .attr('src', gifPicture) // picture viewed
                        .attr('class', 'img-fluid') // responsive img
                        .attr('data-animate', gifPicture) // data animate URL
                        .attr('data-still', stillPicture) // data still URL
                        .attr('data-state', 'animate') // current state
                        .attr('id', 'gif') // styiling
                        .prependTo( $('#gifContainer') )
                
                }
            })
        }

    //this onClick function will pass the buttons attrivute 'data-nameFull'
    //into our search function and produce results
    $('#button-div').on('click', 'button', function() { // original buttons
        findGif( $(this).attr('data-nameFull'))
    })

    //this onClick function will take anything in the search bar and
    //pass it into both the search and produce functions
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

    //this click function will operate everything that happens when you
    //click on an individual picture
    $(document.body).on('click', ('#gifContainer'), function() {
        console.log($(this).attr('data-url')) // saving for URL
        $(this).children('img').addClass('gifOnClick') // fadeOut animation
        $(this).children('img').attr('data-state', 'still') // changes state
        $(this).children('img').attr('src', $(this).children('img').attr('data-still')) // stops the gif
        $(this).children('div').fadeIn() // display text (title and author)
    })

    //when the user moves their mouse away or simply clicks elsewhere (mobile),
    //it executes this
    $(document.body).on('mouseleave', ('#gifContainer'), function() {
        $(this).children('img').attr('src', $(this).children('img').attr('data-animate')) // reanimate
        $(this).children('img').attr('data-state', 'animate') // changes state
        $(this).children('img').removeClass('gifOnClick') // no longer see through
        $(this).children('div').fadeOut(0) // text disappears
    })
})