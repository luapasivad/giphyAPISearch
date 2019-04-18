$(document).ready(function() { 

    var buttonsArr = [],
        buttonDiv = $('#button-div'),
        gifDiv = $('#gif-div'),
        tempCount = 0,
        apiKey = "ndbwFLDCgCF2OFf18Ngskc2e069zKEFT";

    var lastButtonPushed = "";

        // button = $('#button') // not sure if necessary


    $.ajax({ // ajax call for default buttons
        url: 'https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=7&rating=G', // static URL - pulls first 15 trending pictures
        method: "GET"
        }).then(function(starterButtons) {
            // console.log(starterButtons) // for test
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
        // console.log(titleDisplay)
        $('<button>')
            .text( titleDisplay )
            .attr('type', 'submit')
            .attr('data-title', titleDisplay)
            .attr('id', 'button')
            .attr('data-pushCount', 0)
            .attr('class', 'btn btn-primary btn-sm')
            .appendTo( $(buttonDiv) );
        }
    }

    function findGif(string) {

        $('#moreContent').remove() // remove moreContent buttona as another will be made

        var toSearch = string // sets the dynamic api link
        var offset = tempCount * 10 // used to offset search when a button is used again
        var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key='+ apiKey + '&q=' + toSearch +'&limit=10&offset='+ offset +'&rating=G&lang=en'
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
                    // console.log(response)
                    var gifPicture = response.data[i].images.downsized.url // moving URL
                    var stillPicture = response.data[i].images.downsized_still.url // still URL
                    var gifName = response.data[i].title.replace(/ GIF.*$/i, ""); // gif title with end cut off
                        gifTarget = response.data[i].id
                    var gifUser;


                    if (response.data[i].title != "") { // if there is no title
                        gifName =  response.data[i].title
                    } else {
                        gifName = "untitled"
                    }

                    if (response.data[i].username != "") { // if there is no user
                        gifUser = "by " + response.data[i].username
                    } else {
                        gifUser = "by unknown"
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
                        .attr('class', 'gifText user') // targeting & styling
                        .html(gifUser) // title - user
                        .prependTo( $('#' + gifTarget) ) // 

                    $('<div>') // text placed within container
                        .attr('class', 'gifText title') // targeting & styling
                        .attr('data-title', gifName)
                        .html(gifName) // title - user
                        .prependTo( $('#' + gifTarget) ) // 
                    
                    
                    
                }
            })
                    //button to add more gifs of the same topic as what was previously
                    //selected. Works in conjunction with the buttons on the side

                    setTimeout(function() { // on a timer to ensure it happens after the ajax call 
                        $('<button>') // more of the same content button
                            .attr('id', 'moreContent') // targetting
                            .attr('data-searched', string) // the last thing searched
                            .attr('class', 'btn btn-primary btn-block btn-sm') // button styling
                            .attr('data-pushCount', tempCount) // tracks offset
                            .text("find more of " + string) // text
                            .appendTo('#gif-div') 
                        }, 2000)

        }

    //this onClick function will pass the buttons attbivute 'data-title'
    //into our search function and produce results
    buttonDiv.on('click', 'button', function() {// original buttons
        lastButtonPushed = $(this).attr('data-title') // tracks what sidebar button has been pushed last for the moreContent button
        tempCount =  parseInt($(this).attr('data-pushCount')) // this updates a buttons count as to how many times it has been pressed in conjunction with the corresponding sidebar button
        findGif( $(this).attr('data-title')) // calls function to find the GIFs
        tempCount++ // increment for offset
        $(this).attr('data-pushCount', tempCount) // updates sidebar buttons pushcount
    })

    //this onClick function will take anything in the search bar and
    //pass it into both the search and produce functions
    $('#search-div').on('click', 'button', function() { // user made buttons
        var userSearch = $('#userSearch')
        var search = userSearch.val()

        if (search.length != "") {
            buttonCreate(search)
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

    //onClick event for the moreContent button, dynamically updates the
    //tempcount for the offset with whatever the corresponding sidebar
    //button is. removes itself after clicking and readds a new one after
    //content is loaded
    gifDiv.on('click', 'button', function() {
        findGif( $('#moreContent').attr('data-searched')) // calls function to find the GIFs
        tempCount=tempCount+1 // incrememnt tempCount
        // if (lastButtonPushed === $(this).attr('data-searched')) { 
        $('[data-title="'+lastButtonPushed+'"').attr('data-pushCount', tempCount)
        // }
        $(this).remove()
    })

    gifDiv.on('click', '.title', function() {
        findGif($(this).text().replace(/ GIF.*$/i, ""))
        tempCount = tempCount + 1
    })
        
})