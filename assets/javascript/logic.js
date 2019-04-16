$(document).ready(function() { 

    var buttonsArr = []
        buttonDiv = $('#button-div')
        button = $('#button')


    $.ajax({ // ajax call for defaiult buttons
        url: 'https://api.giphy.com/v1/gifs/trending?api_key=d0oobYxRk095EpbUG3rFBW8diHv0ioio&limit=15&rating=G', // static URL - pulls first 15 trending pictures
        method: "GET"
        }).then(function(response) {
            for (var i=0; i<15; i++) {
                var tempTitle = response.data[i].title // get the title for each picture
                
                if (tempTitle.length != "" ) { // if it has a title
                    console.log(tempTitle)
                tempTitle = tempTitle.replace(/ GIF.*$/i, ""); // cut off everything after "GIF" including it in the title
                buttonsArr.push(tempTitle); // add to buttonsArr
                // tempTitleSplit = tempTitle.split(" ",2) // to add data-name shortened to the first word
                $('<button>')
                    .text( tempTitle )
                    // .attr('data-name', tempTitleSplit[0])
                    .attr('data-nameFull', tempTitle)
                    .attr('id', 'button')
                    .attr('class', 'btn btn-primary btn-small btn-block')
                    .attr('type', 'button')
                    .appendTo( $(buttonDiv) );

                }
           }
           console.log(buttonsArr)
    })



})