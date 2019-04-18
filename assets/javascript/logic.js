$(document).ready(function() { 

    var buttonsArr = [],
        buttonDiv = $('#button-div'),
        gifDiv = $('#gif-div'),
        tempCount;

        // button = $('#button') // not sure if necessary


    $.ajax({ // ajax call for default buttons
        url: 'https://api.giphy.com/v1/gifs/trending?api_key=iUxtIFwExyAwP5SO88cIsiR0vlJqdLvX&limit=7&rating=G', // static URL - pulls first 15 trending pictures
        method: "GET"
        }).then(function(starterButtons) {
            console.log(starterButtons) // for test
            for (var i=0; i<7; i++) {
                var title = starterButtons.data[i].title // get the title for each picture
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
            .text( titleDisplay ) // .attr('data-name', tempTitleSplit[0])
            .attr('type', 'submit')
            .attr('data-nameFull', titleDisplay)
            .attr('id', 'button')
            .attr('data-pushCount', 0)
            .attr('class', 'btn btn-primary btn-sm')
            .prependTo( $(buttonDiv) );
        }
    }

    function findGif(string) {

        var toSearch = string // sets the dynamic api link
        var offset = tempCount * 10 // used to offset search when a button is used again
        var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=iUxtIFwExyAwP5SO88cIsiR0vlJqdLvX&q=' + toSearch +'&limit=10&offset='+ offset +'&rating=G&lang=en'
        var gifTarget;
        var tutorial = false; // has the tutorial run
        
        if (tutorial == false) {
            tutorial = true // no more tutorial
            $('.example').remove() // clear out tutorial
        }

        $.ajax({ // ajax call for user made buttons
            url: queryURL,
            method: "GET"
            }).then(function(response) {

                for (var i=0; i<10; i++) { // takes all 10 results
                    console.log(response)
                    var gifPicture = response.data[i].images.downsized.url // moving URL
                    var stillPicture = response.data[i].images.downsized_still.url // still URL
                    var gifName = response.data[i].title.replace(/ GIF.*$/i, ""); // gif title with end cut off
                        gifTarget = response.data[i].id
                    var gifUser;

                    if (response.data[i].username != "") { // needs work
                        gifUser = "by " + response.data[i].username
                    } else {
                        gifUser = ""
                    }

                    $('<div>') // container holding each gif and its info
                        .attr('class', 'gifContainer gif') // targeting
                        .attr('id', gifTarget)
                        .appendTo( $(gifDiv) )

                    $('<img>') // prepends them to the screen
                        .attr('src', gifPicture) // picture viewed
                        .attr('class', 'img-fluid gif') // responsive img
                        .attr('data-animate', gifPicture) // data animate URL
                        .attr('data-still', stillPicture) // data still URL
                        .attr('data-state', 'animate') // current state
                        .prependTo( $('#' + gifTarget) )

                    $('<div>') // text placed within container
                        .attr('class', 'gifText title') // targeting & styling
                        .attr('data-title', gifName)
                        .html(gifName) // title - user
                        .prependTo( $('#' + gifTarget) ) // 
                    
                    $('<div>') // text placed within container
                        .attr('class', 'gifText user') // targeting & styling
                        .html(gifUser) // title - user
                        .prependTo( $('#' + gifTarget) ) // 
                    
                }
            })
                    //button to add more gifs, didnt work as intended and not
                    //necessarry but saving in case I want to add a button at the
                    //bottom of the page

                    setTimeout(function() { 
                        $('<button>') // more of the same content button
                            .attr('id', 'moreContent') // targetting
                            .attr('data-searched', string) // the last thing searched
                            .attr('class', 'btn btn-primary btn-block btn-sm') // button styling
                            .text("find more of " + string) // text
                            .appendTo('#gif-div') }, 2000)

        }

    //this onClick function will pass the buttons attrivute 'data-nameFull'
    //into our search function and produce results
    $('#button-div').on('click', 'button', function() {// original buttons
        tempCount =  parseInt($(this).attr('data-pushCount')) // this updates a buttons count as to how many times it has been pressed
        $(this).attr('data-pushCount', tempCount++) // this intervals our tempCount and updates the buttons pushcount
        findGif( $(this).attr('data-nameFull')) // calls function to find the GIFs
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
    gifDiv.on('click', 'div' ,function() {
        if ($(this).children('img').attr('data-state')=='still') { // if the image has already been clicked
            $(this).children('img')
                .attr('src', $(this).children('img').attr('data-animate')) // reanimate
                .attr('data-state', 'animate') // changes state
                .removeClass('gifOnClick') // no longer see through
            $(this).children('.gifText').fadeOut(0) // text disappears 
 
        } else { // if the image has not been clicked already
        
        console.log($(this).attr('data-url')) // saving for URL
        $(this).children('img')
            .attr('src', $(this).children('img').attr('data-still')) // stops the gif
            .addClass('gifOnClick') // fadeOut animation
            .attr('data-state', 'still') // changes state
        $(this).children('.gifText').fadeIn() // display text (title and author)

        }
    })

    //when the user moves their mouse away or simply clicks elsewhere (mobile),
    //it executes this
    gifDiv.on('mouseleave', 'div', function() {
        $(this).children('img')
            .attr('src', $(this).children('img').attr('data-animate')) // reanimate
            .attr('data-state', 'animate') // changes state
            .removeClass('gifOnClick') // no longer see through
        $(this).children('.gifText').fadeOut(0) // text disappears
    })
        
})