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
                    var gifPicture = response.data[i].images.downsized.url
                    var stillPicture = response.data[i].images.downsized_still.url
                    var gifName = response.data[i].title.replace(/ GIF.*$/i, "");
                    var userGif;

                    if (response.data[i].username != "") {
                        userGif = response.data[i].username
                        console.log('done')
                    }
    

                    // ! make user fade stored specific to the image div

                    $('<div>')
                        .attr('id', 'gifContainer')
                        .attr('class', 'gif')
                        .attr('data-user', userGif)
                        .prependTo( $(gifDiv) )

                    $('<div>')
                        .attr('id', 'gifText')
                        .text(gifName +' - '+ userGif)
                        .prependTo( $('#gifContainer') )

                    $('<img>') // prepends them to the screen
                        .attr('src', gifPicture)
                        .attr('class', 'img-fluid')
                        .attr('data-animate', gifPicture)
                        .attr('data-still', stillPicture)
                        .attr('data-state', 'animate')
                        .attr('id', 'gif')
                        .prependTo( $('#gifContainer') )
                
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
    

    var hoverTimeout;
    var current;

    // $(document.body).on('mouseenter', ('#gifContainer'), function() {
    //    current = $(this)
    //     // $(this).children('div').fadeIn()
    //     hoverTimeout = setTimeout(function() {
    //         current.addClass('gifOnHover')
    //         current.children('div').fadeIn()
    //         console.log('hi')
    //     }, 1000)
    // })

    

    $(document.body).on('click', ('#gifContainer'), function() {
        console.log($(this).attr('data-url'))
        $(this).children('img').addClass('gifOnClick')
        $(this).children('img').attr('src', $(this).children('img').attr('data-still'))
        $(this).children('div').fadeIn()
        console.log('hi')
    })

    $(document.body).on('mouseleave', ('#gifContainer'), function() {
        $(this).children('img').attr('src', $(this).children('img').attr('data-animate'))
        $(this).children('img').removeClass('gifOnClick')
        $(this).children('div').fadeOut(0)
    })
})